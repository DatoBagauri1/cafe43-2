import { useGetShopStatus } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";

export function OpenBadge() {
  const { data, isLoading } = useGetShopStatus();
  const { t } = useLang();

  if (isLoading) return <Skeleton className="h-6 w-24 rounded-full" />;
  if (!data) return null;

  return (
    <Badge 
      variant="outline" 
      className={`font-medium ${data.isOpen ? 'text-green-600 border-green-600 dark:text-green-400 dark:border-green-400' : 'text-orange-600 border-orange-600 dark:text-orange-400 dark:border-orange-400'}`}
    >
      {data.isOpen ? t("openNow") : `${t("opensAt")} ${data.opensAt}`}
    </Badge>
  );
}
