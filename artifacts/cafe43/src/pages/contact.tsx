import { useGetShopInfo, useGetShopStatus } from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OpenBadge } from "@/components/open-badge";

export default function Contact() {
  const { t } = useLang();
  const { data: info, isLoading } = useGetShopInfo();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-48 mb-12" />
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-xl mb-12">
        <h1 className="font-serif text-4xl font-bold mb-4">{t("contact")}</h1>
        <p className="text-muted-foreground text-lg">
          We'd love to hear from you. Drop by for a pastry, or get in touch.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="w-6 h-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-serif font-bold text-xl mb-2">Location</h3>
                  <p className="text-muted-foreground text-lg">{info?.address || "189 David Agmashenebeli Ave"}</p>
                  <p className="text-muted-foreground text-lg">{info?.city || "Tbilisi, Georgia"}</p>
                  
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=189+David+Agmashenebeli+Ave+Tbilisi"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 text-primary font-medium hover:underline"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <Clock className="w-6 h-6 text-primary mt-1 shrink-0" />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-serif font-bold text-xl">Hours</h3>
                    <OpenBadge />
                  </div>
                  <p className="text-muted-foreground text-lg">{info?.hours || "Daily 10:00 - 22:00"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-serif font-bold text-xl mb-2">Contact Info</h3>
                  <p className="text-muted-foreground text-lg mb-1">{info?.phone || "+995 32 243 43 43"}</p>
                  <p className="text-muted-foreground text-lg">{info?.email || "hello@cafe43.ge"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="aspect-[4/5] lg:aspect-auto lg:h-[700px] rounded-2xl overflow-hidden shadow-lg border bg-muted dark:border-white/10 dark:bg-[rgba(255,255,255,0.04)] dark:shadow-[0_28px_80px_-38px_rgba(0,0,0,0.92)]">
          <iframe
            src="https://www.google.com/maps?q=189+David+Agmashenebeli+Ave+Tbilisi&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
