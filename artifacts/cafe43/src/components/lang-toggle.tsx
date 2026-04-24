import { useLang } from "@/lib/i18n";
import { Languages } from "lucide-react";

export function LangToggle() {
  const { lang, toggle } = useLang();

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1.5 px-2.5 h-9 rounded-md hover:bg-accent transition-colors text-xs font-semibold uppercase tracking-wider"
      aria-label={`Switch language (currently ${lang === "en" ? "English" : "Georgian"})`}
      title={lang === "en" ? "Switch to Georgian" : "Switch to English"}
    >
      <Languages className="h-4 w-4 text-muted-foreground" />
      <span className={lang === "en" ? "text-primary" : "text-muted-foreground"}>EN</span>
      <span className="text-muted-foreground/50">/</span>
      <span className={lang === "ka" ? "text-primary" : "text-muted-foreground"}>KA</span>
    </button>
  );
}
