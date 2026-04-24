import { useState, useEffect, useMemo } from "react";
import { useListMenu } from "@workspace/api-client-react";
import { Category } from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { MenuCard } from "@/components/menu-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Menu() {
  const { t } = useLang();
  const defaultCategory = useMemo(
    () => new URLSearchParams(window.location.search).get("category") || "all",
    [],
  );

  const [category, setCategory] = useState<string>(defaultCategory);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: items, isLoading } = useListMenu({
    category: category !== "all" ? (category as Category) : undefined,
    search: debouncedSearch || undefined,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">{t("menu")}</h1>
          <p className="text-muted-foreground">Handcrafted with love and butter</p>
        </div>
        
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search menu..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue={category} onValueChange={setCategory} className="mb-8">
        <TabsList className="w-full md:w-auto overflow-x-auto justify-start h-auto p-1 flex-nowrap">
          <TabsTrigger value="all" className="px-6 py-2">All</TabsTrigger>
          <TabsTrigger value={Category.cakes} className="px-6 py-2 capitalize">{Category.cakes}</TabsTrigger>
          <TabsTrigger value={Category.pastries} className="px-6 py-2 capitalize">{Category.pastries}</TabsTrigger>
          <TabsTrigger value={Category.drinks} className="px-6 py-2 capitalize">{Category.drinks}</TabsTrigger>
          <TabsTrigger value={Category.chocolate} className="px-6 py-2 capitalize">{Category.chocolate}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          ))
        ) : items?.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No items found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          items?.map(item => (
            <MenuCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
