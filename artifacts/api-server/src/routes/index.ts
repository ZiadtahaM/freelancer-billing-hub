import { Router, type IRouter } from "express";
import healthRouter from "./health";
import menuCategoriesRouter from "./menuCategories";
import menuItemsRouter from "./menuItems";
import ordersRouter from "./orders";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(menuCategoriesRouter);
router.use(menuItemsRouter);
router.use(ordersRouter);
router.use(dashboardRouter);

export default router;
