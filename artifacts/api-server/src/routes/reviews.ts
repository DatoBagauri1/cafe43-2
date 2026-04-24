import { Router, type IRouter } from "express";
import { db, reviewsTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";
import { CreateReviewBody } from "@workspace/api-zod";
import { serializeReview } from "../lib/serializers";

const router: IRouter = Router();

router.get("/reviews", async (_req, res) => {
  const rows = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));
  res.json(rows.map(serializeReview));
});

router.post("/reviews", async (req, res) => {
  const body = CreateReviewBody.parse(req.body);
  const [row] = await db
    .insert(reviewsTable)
    .values({
      username: body.username,
      rating: body.rating,
      text: body.text,
    })
    .returning();
  res.status(201).json(serializeReview(row!));
});

router.get("/reviews/summary", async (_req, res) => {
  const [result] = await db
    .select({
      averageRating: sql<string | null>`AVG(${reviewsTable.rating})::text`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(reviewsTable);

  const avg = result?.averageRating ? Number(result.averageRating) : 0;
  const count = result?.count ?? 0;
  res.json({
    averageRating: count > 0 ? Number(avg.toFixed(2)) : 0,
    count,
  });
});

export default router;
