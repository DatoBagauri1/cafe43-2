import { Router, type IRouter } from "express";
import { db, menuItemsTable } from "@workspace/db";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  ListMenuQueryParams,
  CreateMenuItemBody,
  UpdateMenuItemBody,
  GetMenuItemParams,
} from "@workspace/api-zod";
import { serializeMenuItem } from "../lib/serializers";

const router: IRouter = Router();

router.get("/menu", async (req, res) => {
  const params = ListMenuQueryParams.parse(req.query);

  const filters = [];
  if (params.category) filters.push(eq(menuItemsTable.category, params.category));
  if (params.search) {
    const term = `%${params.search}%`;
    filters.push(
      or(
        ilike(menuItemsTable.name, term),
        ilike(menuItemsTable.nameKa, term),
        ilike(menuItemsTable.description, term),
      )!,
    );
  }

  const where = filters.length ? and(...filters) : undefined;
  const rows = await db
    .select()
    .from(menuItemsTable)
    .where(where)
    .orderBy(desc(menuItemsTable.featured), menuItemsTable.id);
  res.json(rows.map(serializeMenuItem));
});

router.get("/menu/featured", async (_req, res) => {
  const rows = await db
    .select()
    .from(menuItemsTable)
    .where(eq(menuItemsTable.featured, true))
    .orderBy(menuItemsTable.id);
  res.json(rows.map(serializeMenuItem));
});

router.get("/menu/categories", async (_req, res) => {
  const result = await db
    .select({
      category: menuItemsTable.category,
      count: sql<number>`count(*)::int`,
      sampleImageUrl: sql<string>`(array_agg(${menuItemsTable.imageUrl} ORDER BY ${menuItemsTable.featured} DESC, ${menuItemsTable.id}))[1]`,
    })
    .from(menuItemsTable)
    .groupBy(menuItemsTable.category);

  res.json(
    result.map((r) => ({
      category: r.category as "cakes" | "pastries" | "drinks" | "chocolate",
      count: r.count,
      sampleImageUrl: r.sampleImageUrl,
    })),
  );
});

router.get("/menu/:id", async (req, res) => {
  const { id } = GetMenuItemParams.parse(req.params);
  const [row] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, id));
  if (!row) {
    res.status(404).json({ message: "Menu item not found" });
    return;
  }
  res.json(serializeMenuItem(row));
});

router.post("/menu", async (req, res) => {
  const body = CreateMenuItemBody.parse(req.body);
  const [row] = await db
    .insert(menuItemsTable)
    .values({
      name: body.name,
      nameKa: body.nameKa,
      description: body.description,
      descriptionKa: body.descriptionKa,
      price: body.price.toString(),
      category: body.category,
      imageUrl: body.imageUrl,
      featured: body.featured ?? false,
    })
    .returning();
  res.status(201).json(serializeMenuItem(row!));
});

router.patch("/menu/:id", async (req, res) => {
  const { id } = GetMenuItemParams.parse(req.params);
  const body = UpdateMenuItemBody.parse(req.body);

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.nameKa !== undefined) updates.nameKa = body.nameKa;
  if (body.description !== undefined) updates.description = body.description;
  if (body.descriptionKa !== undefined) updates.descriptionKa = body.descriptionKa;
  if (body.price !== undefined) updates.price = body.price.toString();
  if (body.category !== undefined) updates.category = body.category;
  if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl;
  if (body.featured !== undefined) updates.featured = body.featured;

  const [row] = await db
    .update(menuItemsTable)
    .set(updates)
    .where(eq(menuItemsTable.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ message: "Menu item not found" });
    return;
  }
  res.json(serializeMenuItem(row));
});

router.delete("/menu/:id", async (req, res) => {
  const { id } = GetMenuItemParams.parse(req.params);
  await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id));
  res.status(204).end();
});

export default router;
