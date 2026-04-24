import { Router, type IRouter } from "express";
import { db, reviewsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

const TBILISI_TZ = "Asia/Tbilisi";
const OPENS_AT_HOUR = 10;
const CLOSES_AT_HOUR = 22;

function getTbilisiNow(): { hour: number; minute: number; iso: string } {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TBILISI_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  const iso = `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:00+04:00`;
  return { hour, minute, iso };
}

router.get("/shop/status", (_req, res) => {
  const { hour, minute, iso } = getTbilisiNow();
  const minutes = hour * 60 + minute;
  const open = OPENS_AT_HOUR * 60;
  const close = CLOSES_AT_HOUR * 60;
  const isOpen = minutes >= open && minutes < close;
  res.json({
    isOpen,
    opensAt: "10:00",
    closesAt: "22:00",
    currentLocalTime: iso,
  });
});

router.get("/shop/info", async (_req, res) => {
  const [agg] = await db
    .select({
      averageRating: sql<string | null>`AVG(${reviewsTable.rating})::text`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(reviewsTable);

  const dbCount = agg?.count ?? 0;
  const dbAvg = agg?.averageRating ? Number(agg.averageRating) : 0;
  const baseRating = 4.6;
  const baseCount = 77;
  const totalCount = baseCount + dbCount;
  const blendedAvg = totalCount > 0
    ? (baseRating * baseCount + dbAvg * dbCount) / totalCount
    : baseRating;

  res.json({
    name: "CAFE 43",
    tagline: "Premium pastry & dessert shop",
    address: "189 David Agmashenebeli Ave",
    city: "Tbilisi",
    phone: "+995 32 243 43 43",
    email: "hello@cafe43.ge",
    rating: Number(blendedAvg.toFixed(1)),
    reviewCount: totalCount,
    latitude: 41.7211,
    longitude: 44.7982,
    hours: "Daily, 10:00 — 22:00",
  });
});

export default router;
