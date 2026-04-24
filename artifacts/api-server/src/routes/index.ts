import { Router, type IRouter } from "express";
import healthRouter from "./health";
import menuRouter from "./menu";
import reviewsRouter from "./reviews";
import galleryRouter from "./gallery";
import ordersRouter from "./orders";
import shopRouter from "./shop";

const router: IRouter = Router();

router.use(healthRouter);
router.use(menuRouter);
router.use(reviewsRouter);
router.use(galleryRouter);
router.use(ordersRouter);
router.use(shopRouter);

export default router;
