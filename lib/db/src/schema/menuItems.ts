import { pgTable, serial, text, numeric, boolean, timestamp, varchar } from "drizzle-orm/pg-core";

export const menuItemsTable = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameKa: text("name_ka").notNull(),
  description: text("description").notNull(),
  descriptionKa: text("description_ka").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 32 }).notNull(),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type MenuItemRow = typeof menuItemsTable.$inferSelect;
export type InsertMenuItem = typeof menuItemsTable.$inferInsert;
