import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OpenBadge } from "./open-badge";
import { ThemeToggle } from "./theme-toggle";
import { LangToggle } from "./lang-toggle";

export function Header() {
  const { totalCount } = useCart();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/menu", label: t("menu") },
    { href: "/gallery", label: t("gallery") },
    { href: "/reviews", label: t("reviews") },
    { href: "/contact", label: t("contact") },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  const closeMobile = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-serif text-xl sm:text-2xl font-bold tracking-tight"
            onClick={closeMobile}
          >
            CAFE 43
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative py-1 transition-colors hover:text-primary ${
                  isActive(l.href) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {l.label}
                {isActive(l.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded bg-primary" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block">
            <OpenBadge />
          </div>
          <LangToggle />
          <ThemeToggle />
          <Link
            href="/cart"
            className="relative p-2 hover:bg-accent rounded-md transition-colors"
            aria-label={t("cart")}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalCount > 0 && (
              <Badge
                variant="default"
                className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 text-[10px] rounded-full"
              >
                {totalCount}
              </Badge>
            )}
          </Link>
          <button
            type="button"
            className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <nav className="container mx-auto flex flex-col px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={closeMobile}
                className={`py-3 text-base font-medium border-b border-border/40 last:border-0 ${
                  isActive(l.href) ? "text-primary" : "text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4 pb-2">
              <OpenBadge />
              <Link
                href="/admin"
                onClick={closeMobile}
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                {t("admin")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
