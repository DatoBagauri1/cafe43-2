import { useMemo, useState } from "react";
import {
  useListOrders,
  useListMenu,
  useListReviews,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useUpdateOrderStatus,
  getListMenuQueryKey,
  getListOrdersQueryKey,
} from "@workspace/api-client-react";
import { Category, MenuItem, OrderStatus } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { USE_MOCK_API } from "@/lib/runtime-config";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("cafe43.admin") === "true";
  });
  const [passcode, setPasscode] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "cafe43admin") {
      setIsAuthenticated(true);
      localStorage.setItem("cafe43.admin", "true");
    } else {
      alert("Invalid passcode");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("cafe43.admin");
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center font-serif text-2xl">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                type="password" 
                placeholder="Enter passcode" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
              />
              <Button type="submit" className="w-full">Login</Button>
            </form>
            {USE_MOCK_API ? (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Static deploy mode: menu, orders, and reviews are saved in this browser only.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-4xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      {USE_MOCK_API ? (
        <Card className="mb-8 border-dashed bg-muted/30">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Static deploy mode is active. Menu edits, orders, and reviews persist in this browser's local storage so the site can run on Netlify without a paid backend.
          </CardContent>
        </Card>
      ) : null}

      <Tabs defaultValue="orders">
        <TabsList className="mb-8">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="menu">
          <MenuTab />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const STATUS_OPTIONS: OrderStatus[] = ["pending", "preparing", "ready", "completed", "cancelled"];

function statusVariant(status: OrderStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "pending":
      return "default";
    case "preparing":
      return "secondary";
    case "ready":
      return "outline";
    case "completed":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

function OrdersTab() {
  const { data: orders, isLoading } = useListOrders();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: updateStatus } = useUpdateOrderStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "Order updated" });
      },
      onError: () => toast({ title: "Update failed", variant: "destructive" }),
    },
  });

  const filtered = useMemo(() => {
    if (!orders) return [];
    return filter === "all" ? orders : orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders?.length || 0 };
    for (const s of STATUS_OPTIONS) map[s] = 0;
    for (const o of orders || []) map[o.status] = (map[o.status] || 0) + 1;
    return map;
  }, [orders]);

  const totalRevenue = useMemo(
    () => (orders || []).filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    [orders],
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">Loading orders...</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total orders" value={orders?.length ?? 0} />
        <StatCard label="Pending" value={counts.pending ?? 0} />
        <StatCard label="Preparing" value={counts.preparing ?? 0} />
        <StatCard label="Revenue" value={formatPrice(totalRevenue)} />
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <CardTitle>Orders</CardTitle>
          <div className="flex flex-wrap gap-2">
            {(["all", ...STATUS_OPTIONS] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors ${
                  filter === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:bg-accent"
                }`}
              >
                {s} {counts[s] ? `(${counts[s]})` : ""}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">#{String(order.id).padStart(4, "0")}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(order.createdAt), "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-muted-foreground">{order.phone}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={order.address}>
                      {order.address}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm space-y-0.5">
                      {order.items.map((i, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-muted-foreground">{i.quantity}×</span>
                          <span>{i.name}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={statusVariant(order.status)} className="capitalize w-fit">
                        {order.status}
                      </Badge>
                      <Select
                        value={order.status}
                        onValueChange={(val: OrderStatus) =>
                          updateStatus({ id: order.id, data: { status: val } })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No orders {filter !== "all" ? `with status "${filter}"` : "yet"}.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-2 font-serif text-2xl sm:text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function MenuTab() {
  const { data: items, isLoading } = useListMenu();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: deleteItem } = useDeleteMenuItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMenuQueryKey() });
        toast({ title: "Item deleted" });
      }
    }
  });

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>Loading menu...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Menu Items</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>Add Item</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Item" : "Create Item"}</DialogTitle>
            </DialogHeader>
            <MenuItemForm 
              item={editingItem} 
              onComplete={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover" />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="capitalize">{item.category}</TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        if (confirm(`Delete ${item.name}?`)) deleteItem({ id: item.id });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MenuItemForm({ item, onComplete }: { item: MenuItem | null, onComplete: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: item?.name || "",
    nameKa: item?.nameKa || "",
    description: item?.description || "",
    descriptionKa: item?.descriptionKa || "",
    price: item?.price || 0,
    category: item?.category || Category.pastries,
    imageUrl: item?.imageUrl || "/api/assets/pastry_croissant.jpg",
  });

  const { mutate: createItem, isPending: isCreating } = useCreateMenuItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMenuQueryKey() });
        toast({ title: "Item created" });
        onComplete();
      }
    }
  });

  const { mutate: updateItem, isPending: isUpdating } = useUpdateMenuItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMenuQueryKey() });
        toast({ title: "Item updated" });
        onComplete();
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      updateItem({ id: item.id, data: formData });
    } else {
      createItem({ data: formData });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name (EN)</label>
          <Input 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Name (KA)</label>
          <Input 
            value={formData.nameKa} 
            onChange={e => setFormData({...formData, nameKa: e.target.value})} 
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select 
            value={formData.category} 
            onValueChange={(val: Category) => setFormData({...formData, category: val})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Category).map(c => (
                <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Price (₾)</label>
          <Input 
            type="number" 
            step="0.01" 
            min="0"
            value={formData.price} 
            onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image URL</label>
        <Input 
          value={formData.imageUrl} 
          onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
          required 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Description (EN)</label>
          <Textarea 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description (KA)</label>
          <Textarea 
            value={formData.descriptionKa} 
            onChange={e => setFormData({...formData, descriptionKa: e.target.value})} 
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onComplete}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Item"}</Button>
      </div>
    </form>
  );
}

function ReviewsTab() {
  const { data: reviews, isLoading } = useListReviews();

  if (isLoading) return <div>Loading reviews...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews?.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="whitespace-nowrap">{format(new Date(review.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">{review.username}</TableCell>
                <TableCell>{review.rating}/5</TableCell>
                <TableCell className="max-w-[400px] truncate" title={review.text}>{review.text}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
