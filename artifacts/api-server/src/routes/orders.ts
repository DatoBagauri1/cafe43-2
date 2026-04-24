import { Router, type IRouter } from "express";
import { db, ordersTable, menuItemsTable } from "@workspace/db";
import { desc, inArray } from "drizzle-orm";
import { CreateOrderBody } from "@workspace/api-zod";
import { serializeOrder } from "../lib/serializers";
import type { OrderItemSnapshot } from "@workspace/db";

const router: IRouter = Router();

router.get("/orders", async (_req, res) => {
  const rows = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  res.json(rows.map(serializeOrder));
});

router.post("/orders", async (req, res) => {
  const body = CreateOrderBody.parse(req.body);

  const ids = body.items.map((i) => i.menuItemId);
  const rows = await db.select().from(menuItemsTable).where(inArray(menuItemsTable.id, ids));
  const byId = new Map(rows.map((r) => [r.id, r]));

  const snapshots: OrderItemSnapshot[] = [];
  let total = 0;
  for (const item of body.items) {
    const menu = byId.get(item.menuItemId);
    if (!menu) {
      res.status(400).json({ message: `Unknown menu item: ${item.menuItemId}` });
      return;
    }
    const unitPrice = Number(menu.price);
    snapshots.push({
      menuItemId: menu.id,
      name: menu.name,
      unitPrice,
      quantity: item.quantity,
    });
    total += unitPrice * item.quantity;
  }

  const [row] = await db
    .insert(ordersTable)
    .values({
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      notes: body.notes ?? "",
      items: snapshots,
      total: total.toFixed(2),
      status: "pending",
    })
    .returning();

  res.status(201).json(serializeOrder(row!));
});

export default router;
