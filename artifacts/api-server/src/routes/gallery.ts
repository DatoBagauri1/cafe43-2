import { Router, type IRouter } from "express";
import { db, galleryPhotosTable } from "@workspace/db";
import { serializeGalleryPhoto } from "../lib/serializers";

const router: IRouter = Router();

router.get("/gallery", async (_req, res) => {
  const rows = await db.select().from(galleryPhotosTable).orderBy(galleryPhotosTable.id);
  res.json(rows.map(serializeGalleryPhoto));
});

export default router;
