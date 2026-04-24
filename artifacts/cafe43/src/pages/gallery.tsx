import { useState } from "react";
import { useListGallery } from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function Gallery() {
  const { t } = useLang();
  const { data: gallery, isLoading } = useListGallery();
  
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-serif text-4xl font-bold mb-4">{t("gallery")}</h1>
        <p className="text-muted-foreground">A glimpse into our daily craft and spaces.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))
        ) : (
          gallery?.map((photo) => (
            <div 
              key={photo.id} 
              className="group aspect-square rounded-xl overflow-hidden cursor-pointer relative bg-muted"
              onClick={() => setSelectedPhoto(photo.imageUrl)}
            >
              <img 
                src={photo.imageUrl} 
                alt={photo.caption} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))
        )}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
          <VisuallyHidden>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>A larger view of the selected image.</DialogDescription>
          </VisuallyHidden>
          {selectedPhoto && (
            <img 
              src={selectedPhoto} 
              alt="Gallery Preview" 
              className="w-full h-auto max-h-[90vh] object-contain rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
