import { Link } from "wouter";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function Cart() {
  const { t } = useLang();
  const { items, setQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-md">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <h2 className="font-serif text-3xl font-bold mb-4">{t("emptyCart")}</h2>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet. Discover our delicious offerings.
        </p>
        <Link href="/menu">
          <Button size="lg" className="w-full">Explore Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="font-serif text-4xl font-bold mb-8">{t("cart")}</h1>
      
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.menuItemId} className="overflow-hidden">
              <CardContent className="p-0 flex flex-col sm:flex-row">
                <div className="w-full sm:w-32 aspect-square sm:aspect-auto bg-muted shrink-0 dark:bg-[rgba(255,255,255,0.04)] dark:border-r dark:border-white/10">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover dark:[filter:brightness(1.08)_contrast(1.08)_saturate(1.08)]"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="font-serif font-bold text-lg">{item.name}</h3>
                    <div className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border rounded-md h-9">
                      <button 
                        className="px-3 h-full flex items-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        onClick={() => setQuantity(item.menuItemId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <div className="w-8 text-center text-sm font-medium">{item.quantity}</div>
                      <button 
                        className="px-3 h-full flex items-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        onClick={() => setQuantity(item.menuItemId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.menuItemId)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="font-serif text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.menuItemId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                    <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold">{t("total")}</span>
                <span className="font-serif text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
              </div>
              
              <Link href="/checkout">
                <Button size="lg" className="w-full gap-2 text-lg h-14">
                  {t("checkout")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
