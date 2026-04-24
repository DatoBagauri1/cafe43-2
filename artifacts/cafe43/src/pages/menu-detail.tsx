import { useState } from "react";
import { useRoute } from "wouter";
import { useGetMenuItem, getGetMenuItemQueryKey } from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function MenuDetail() {
  const [, params] = useRoute("/menu/:id");
  const id = Number(params?.id);
  const { lang, t } = useLang();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);

  const { data: item, isLoading } = useGetMenuItem(id, {
    query: {
      enabled: !!id,
      queryKey: getGetMenuItemQueryKey(id)
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-6 pt-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="space-y-2 mt-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <Skeleton className="h-12 w-full mt-10" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Item not found</h2>
        <Link href="/menu">
          <Button variant="outline">Return to Menu</Button>
        </Link>
      </div>
    );
  }

  const name = lang === "ka" ? item.nameKa || item.name : item.name;
  const desc = lang === "ka" ? item.descriptionKa || item.description : item.description;

  const handleAdd = () => {
    addItem({
      menuItemId: item.id,
      name,
      unitPrice: item.price,
      quantity,
      imageUrl: item.imageUrl
    });
    toast({
      title: "Added to cart",
      description: `${quantity}x ${name} added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/menu" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Menu
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="aspect-square rounded-2xl overflow-hidden bg-muted dark:bg-[rgba(255,255,255,0.04)] dark:ring-1 dark:ring-white/10 dark:shadow-[0_28px_80px_-38px_rgba(0,0,0,0.92)]">
          <img 
            src={item.imageUrl} 
            alt={name} 
            className="w-full h-full object-cover dark:[filter:brightness(1.08)_contrast(1.08)_saturate(1.08)]"
          />
        </div>
        
        <div className="pt-4 md:pt-8 flex flex-col h-full">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">{item.category}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{name}</h1>
            <div className="text-2xl font-medium text-primary mb-8">{formatPrice(item.price)}</div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              {desc}
            </p>
          </div>

          <div className="mt-auto pt-10 border-t space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center border rounded-md h-12">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-full rounded-none px-4"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-12 text-center font-medium">{quantity}</div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-full rounded-none px-4"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-muted-foreground">
                Total: <span className="font-bold text-foreground">{formatPrice(item.price * quantity)}</span>
              </div>
            </div>

            <Button size="lg" className="w-full h-14 text-lg gap-2" onClick={handleAdd}>
              <ShoppingBag className="h-5 w-5" />
              {t("addToCart")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
