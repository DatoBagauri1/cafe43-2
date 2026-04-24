import { pgTable, serial, text, numeric, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";

export interface OrderItemSnapshot {
  menuItemId: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  notes: text("notes").notNull().default(""),
  items: jsonb("items").$type<OrderItemSnapshot[]>().notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type OrderRow = typeof ordersTable.$inferSelect;
export type InsertOrder = typeof ordersTable.$inferInsert;
