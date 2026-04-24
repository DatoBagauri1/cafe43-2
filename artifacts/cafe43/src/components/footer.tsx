import { useLang } from "@/lib/i18n";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t bg-card mt-auto dark:border-white/10 dark:bg-[rgba(255,255,255,0.02)]">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="font-serif text-2xl font-bold mb-4">CAFE 43</h2>
          <p className="text-muted-foreground max-w-sm mb-2">
            189 David Agmashenebeli Ave, Tbilisi, Georgia
          </p>
          <p className="text-muted-foreground">
            +995 32 243 43 43
          </p>
        </div>
        
        <div className="text-left md:text-right">
          <p className="font-medium mb-2">{t("home")}</p>
          <p className="text-sm text-muted-foreground">10:00 - 22:00</p>
          <p className="text-sm text-muted-foreground mt-8">© {new Date().getFullYear()} CAFE 43. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
