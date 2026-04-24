import { Link } from "wouter";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OpenBadge } from "./open-badge";
import { ThemeToggle } from "./theme-toggle";
import { LangToggle } from "./lang-toggle";

export function Header() {
  const { totalCount } = useCart();
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight">
            CAFE 43
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors">{t("home")}</Link>
            <Link href="/menu" className="hover:text-primary transition-colors">{t("menu")}</Link>
            <Link href="/gallery" className="hover:text-primary transition-colors">{t("gallery")}</Link>
            <Link href="/reviews" className="hover:text-primary transition-colors">{t("reviews")}</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">{t("contact")}</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <OpenBadge />
          </div>
          <LangToggle />
          <ThemeToggle />
          <Link href="/cart" className="relative p-2 hover:bg-accent rounded-md transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {totalCount > 0 && (
              <Badge 
                variant="default" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
              >
                {totalCount}
              </Badge>
            )}
            <span className="sr-only">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
