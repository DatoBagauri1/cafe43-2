import { useLocation, Link } from "wouter";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useCreateOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().min(4, "Phone is required"),
  address: z.string().min(5, "Delivery address is required"),
  notes: z.string().optional(),
});

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { t } = useLang();
  const { items, totalPrice, clear } = useCart();
  const { toast } = useToast();

  const { mutate: createOrder, isPending } = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        clear();
        setLocation(`/checkout/success?id=${order.id}&total=${order.total}`);
      },
      onError: () => {
        toast({ title: "Checkout failed", description: "Please try again later.", variant: "destructive" });
      }
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/menu">
          <Button>Return to Menu</Button>
        </Link>
      </div>
    );
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    createOrder({
      data: {
        ...values,
        items: items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity }))
      }
    });
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>
      
      <h1 className="font-serif text-4xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+995 ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Street, building, apartment..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any special instructions?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full mt-4 h-12" disabled={isPending}>
                    {isPending ? "Processing..." : "Place Order"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.menuItemId} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm leading-tight">{item.name}</div>
                      <div className="text-muted-foreground text-xs">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium text-sm">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Total to pay</span>
                <span className="font-serif font-bold text-primary">{formatPrice(totalPrice)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
