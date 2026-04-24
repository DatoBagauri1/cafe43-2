import { Link, useLocation } from "wouter";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingBag, Truck, Clock, MapPin } from "lucide-react";

const formSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(4, "Phone is required")
    .regex(/^[0-9+()\-\s]+$/u, "Please enter a valid phone number"),
  address: z.string().min(5, "Delivery address is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { t } = useLang();
  const { items, totalPrice, clear } = useCart();
  const { toast } = useToast();

  const { mutate: createOrder, isPending } = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        clear();
        toast({
          title: t("orderConfirmed"),
          description: `${t("orderId")} #${String(order.id).padStart(4, "0")}`,
        });
        setLocation(`/checkout/success?id=${order.id}&total=${order.total}`);
      },
      onError: () => {
        toast({
          title: "Checkout failed",
          description: "Please try again — your cart was kept safe.",
          variant: "destructive",
        });
      },
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phone: "+995 ",
      address: "",
      notes: "",
    },
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 sm:py-32 text-center max-w-md">
        <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-3xl font-bold mb-3">{t("emptyCart")}</h2>
        <p className="text-muted-foreground mb-8">{t("cartHelper")}</p>
        <Link href="/menu">
          <Button size="lg">{t("backToMenu")}</Button>
        </Link>
      </div>
    );
  }

  function onSubmit(values: FormValues) {
    createOrder({
      data: {
        ...values,
        notes: values.notes || "",
        items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      },
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToCart")}
      </Link>

      <div className="mb-8 sm:mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-balance">
          {t("checkout")}
        </h1>
        <p className="text-muted-foreground">
          {t("contactCtaBody")}
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-10">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">{t("deliveryDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fullName")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Mariam Beridze" autoComplete="name" {...field} />
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
                        <FormLabel>{t("phone")}</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="+995 ..."
                            {...field}
                          />
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
                        <FormLabel>{t("address")}</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Street, building, apartment, intercom..."
                            autoComplete="street-address"
                            {...field}
                          />
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
                        <FormLabel>{t("notes")}</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder={t("notesPlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                    disabled={isPending}
                  >
                    {isPending ? t("processing") : `${t("placeOrder")} · ${formatPrice(totalPrice)}`}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-3 gap-3">
            <InfoTile icon={<Truck className="h-4 w-4" />} title={t("delivery")} value={t("free")} />
            <InfoTile icon={<Clock className="h-4 w-4" />} title="ETA" value={t("aboutMin")} />
            <InfoTile icon={<MapPin className="h-4 w-4" />} title="Area" value={t("deliveryArea")} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center justify-between">
                <span>{t("yourOrder")}</span>
                <span className="text-xs font-sans font-normal text-muted-foreground">
                  {items.length} {items.length === 1 ? t("item") : t("items")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2 -mr-2 scrollbar-thin">
                {items.map((item) => (
                  <div key={item.menuItemId} className="flex items-start gap-3">
                    <div className="w-14 h-14 bg-muted rounded-md overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm leading-tight truncate">{item.name}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">
                        {item.quantity} × {formatPrice(item.unitPrice)}
                      </div>
                    </div>
                    <div className="font-medium text-sm whitespace-nowrap">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-5" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("subtotal")}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("delivery")}</span>
                  <span>{t("free")}</span>
                </div>
              </div>

              <Separator className="my-5" />

              <div className="flex justify-between items-baseline">
                <span className="font-semibold">{t("total")}</span>
                <span className="font-serif font-bold text-2xl text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function InfoTile({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-3 flex items-center gap-3">
      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}
