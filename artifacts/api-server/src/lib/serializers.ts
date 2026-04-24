import type { MenuItemRow, ReviewRow, GalleryPhotoRow, OrderRow, OrderItemSnapshot } from "@workspace/db";

export function serializeMenuItem(row: MenuItemRow) {
  return {
    id: row.id,
    name: row.name,
    nameKa: row.nameKa,
    description: row.description,
    descriptionKa: row.descriptionKa,
    price: Number(row.price),
    category: row.category as "cakes" | "pastries" | "drinks" | "chocolate",
    imageUrl: row.imageUrl,
    featured: row.featured,
    createdAt: row.createdAt.toISOString(),
  };
}

export function serializeReview(row: ReviewRow) {
  return {
    id: row.id,
    username: row.username,
    rating: row.rating,
    text: row.text,
    createdAt: row.createdAt.toISOString(),
  };
}

export function serializeGalleryPhoto(row: GalleryPhotoRow) {
  return {
    id: row.id,
    imageUrl: row.imageUrl,
    caption: row.caption,
  };
}

export function serializeOrder(row: OrderRow) {
  return {
    id: row.id,
    customerName: row.customerName,
    phone: row.phone,
    address: row.address,
    notes: row.notes,
    items: row.items as OrderItemSnapshot[],
    total: Number(row.total),
    status: row.status as "pending" | "confirmed" | "ready" | "delivered" | "cancelled",
    createdAt: row.createdAt.toISOString(),
  };
}
