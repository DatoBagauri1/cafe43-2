import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const galleryPhotosTable = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption").notNull(),
});

export type GalleryPhotoRow = typeof galleryPhotosTable.$inferSelect;
export type InsertGalleryPhoto = typeof galleryPhotosTable.$inferInsert;
