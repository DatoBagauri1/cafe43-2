import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === "en" ? "ka" : "en")}
      className="font-medium font-serif tracking-wider uppercase text-xs"
    >
      {lang}
    </Button>
  );
}
