import { Link } from "wouter";
import { useLang } from "@/lib/i18n";
import { useListFeaturedMenu, useGetReviewSummary, useListReviews, useListCategoriesSummary, useListGallery, useGetShopInfo } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { MenuCard } from "@/components/menu-card";
import { ReviewCard } from "@/components/review-card";
import { Star, MapPin, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { t, lang } = useLang();
  
  const { data: featured, isLoading: featuredLoading } = useListFeaturedMenu();
  const { data: summary } = useGetReviewSummary();
  const { data: reviews } = useListReviews();
  const { data: categories } = useListCategoriesSummary();
  const { data: gallery } = useListGallery();
  const { data: info } = useGetShopInfo();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-card overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-multiply dark:opacity-50 dark:mix-blend-normal dark:scale-[1.03]" />
        <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(180deg,rgba(251,247,242,0.78),rgba(250,245,239,0.88))] dark:bg-[radial-gradient(circle_at_top,rgba(201,133,67,0.14),transparent_34%),linear-gradient(180deg,rgba(12,10,8,0.32),rgba(12,10,8,0.76))]" />
        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-4">CAFE 43</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
            {info?.tagline || "Handcrafted cakes, French pastries, and fine coffee in the heart of Tbilisi."}
          </p>
          
          <div className="flex items-center gap-2 mb-8 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border shadow-sm dark:border-white/10 dark:bg-[rgba(12,10,8,0.55)]">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <span className="font-bold">{summary?.averageRating.toFixed(1) || "4.6"}</span>
            <span className="text-muted-foreground text-sm">/ 5 from {summary?.count || 77}+ reviews</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/menu" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-base h-12 px-8">
                {t("orderNow")}
              </Button>
            </Link>
            <Link href="/menu" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full text-base h-12 px-8">
                {t("viewMenu")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2">{t("featuredItems")}</h2>
              <p className="text-muted-foreground">Our most beloved creations</p>
            </div>
            <Link href="/menu">
              <Button variant="ghost" className="hidden sm:flex">{t("viewMenu")}</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            ) : (
              featured?.slice(0, 4).map(item => (
                <MenuCard key={item.id} item={item} />
              ))
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/menu">
              <Button variant="outline" className="w-full">{t("viewMenu")}</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold mb-10 text-center">{t("categories")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories?.map(c => (
              <Link key={c.category} href={`/menu?category=${c.category}`}>
                <div className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer">
                  <img 
                    src={c.sampleImageUrl} 
                    alt={c.category} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 dark:[filter:brightness(1.06)_contrast(1.08)_saturate(1.08)]"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center dark:bg-black/18 dark:group-hover:bg-black/30">
                    <h3 className="font-serif text-2xl font-bold text-white capitalize tracking-wide">
                      {c.category}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold">{t("aboutUs")}</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              A neighborhood Tbilisi pastry shop that feels like stepping into a small European patisserie. We believe in warm golden lighting, glass cases filled with daily fresh bakes, marble counters, and the irresistible smell of butter and roasted coffee. We are refined but not stuffy. We don't shout; our pastries do the talking.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Teaser */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-serif text-3xl font-bold">{t("gallery")}</h2>
            <Link href="/gallery">
              <Button variant="ghost">{t("gallery")} →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery?.slice(0, 4).map((photo) => (
              <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-muted">
                <img 
                  src={photo.imageUrl} 
                  alt={photo.caption} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 dark:[filter:brightness(1.07)_contrast(1.08)_saturate(1.08)]" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Teaser */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-serif text-3xl font-bold">{t("recentReviews")}</h2>
            <Link href="/reviews">
              <Button variant="ghost">{t("reviews")} →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews?.slice(0, 3).map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Location / Contact */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="font-serif text-3xl font-bold">{t("contact")}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Visit Us</h3>
                    <p className="text-muted-foreground">{info?.address || "189 David Agmashenebeli Ave"}</p>
                    <p className="text-muted-foreground">{info?.city || "Tbilisi, Georgia"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Hours</h3>
                    <p className="text-muted-foreground">{info?.hours || "Daily 10:00 - 22:00"}</p>
                  </div>
                </div>
              </div>

              <Link href="/contact">
                <Button size="lg">{t("contact")}</Button>
              </Link>
            </div>
            
            <div className="aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps?q=189+David+Agmashenebeli+Ave+Tbilisi&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
