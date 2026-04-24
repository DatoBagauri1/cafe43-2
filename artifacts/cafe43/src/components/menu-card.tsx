import { Link } from "wouter";
import { MenuItem } from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function MenuCard({ item }: { item: MenuItem }) {
  const { lang, t } = useLang();
  const { addItem } = useCart();
  const { toast } = useToast();

  const name = lang === "ka" ? item.nameKa || item.name : item.name;
  const desc = lang === "ka" ? item.descriptionKa || item.description : item.description;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      menuItemId: item.id,
      name,
      unitPrice: item.price,
      quantity: 1,
      imageUrl: item.imageUrl
    });
    toast({
      title: "Added to cart",
      description: `${name} has been added.`,
    });
  };

  return (
    <Link href={`/menu/${item.id}`}>
      <Card className="overflow-hidden group cursor-pointer transition-all hover:shadow-md hover:-translate-y-1">
        <div className="aspect-[4/3] overflow-hidden relative bg-muted">
          <img 
            src={item.imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-serif font-bold text-lg line-clamp-1">{name}</h3>
            <span className="font-medium text-primary shrink-0">{formatPrice(item.price)}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{desc}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button onClick={handleAdd} variant="secondary" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            {t("addToCart")}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
