import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, ordersTable, orderItemsTable, menuItemsTable, menuCategoriesTable } from "@workspace/db";
import { GetTopSellingItemsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

router.get("/dashboard/stats", async (_req, res) => {
  const { start, end } = todayRange();

  const todayOrders = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        sql`${ordersTable.createdAt} >= ${start}`,
        sql`${ordersTable.createdAt} <= ${end}`
      )
    );

  const ordersToday = todayOrders.length;
  const paidOrders = todayOrders.filter((o) => o.paymentStatus === "paid").length;
  const unpaidOrders = todayOrders.filter((o) => o.paymentStatus === "unpaid").length;
  const revenueToday = todayOrders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const avgOrderValue = ordersToday > 0
    ? todayOrders.reduce((sum, o) => sum + Number(o.total), 0) / ordersToday
    : 0;
  const activeOrders = todayOrders.filter((o) =>
    ["new", "preparing", "ready"].includes(o.status)
  ).length;

  const allOrders = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        sql`${ordersTable.createdAt} >= ${start}`,
        sql`${ordersTable.createdAt} <= ${end}`,
        sql`${ordersTable.paymentStatus} = 'paid'`
      )
    );

  let topSellingCategory: string | null = null;
  if (allOrders.length > 0) {
    const orderIds = allOrders.map((o) => o.id);
    const catCounts = await db
      .select({
        categoryId: menuItemsTable.categoryId,
        count: sql<number>`COUNT(*)`,
      })
      .from(orderItemsTable)
      .innerJoin(menuItemsTable, eq(orderItemsTable.menuItemId, menuItemsTable.id))
      .where(
        sql`${orderItemsTable.orderId} = ANY(ARRAY[${sql.join(
          orderIds.map((id) => sql`${id}`),
          sql`, `
        )}]::int[])`
      )
      .groupBy(menuItemsTable.categoryId)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(1);

    if (catCounts.length > 0) {
      const [cat] = await db
        .select({ name: menuCategoriesTable.name })
        .from(menuCategoriesTable)
        .where(eq(menuCategoriesTable.id, catCounts[0].categoryId));
      topSellingCategory = cat?.name ?? null;
    }
  }

  res.json({
    ordersToday,
    revenueToday: Math.round(revenueToday * 100) / 100,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    activeOrders,
    topSellingCategory,
    paidOrders,
    unpaidOrders,
  });
});

router.get("/dashboard/top-items", async (req, res) => {
  const params = GetTopSellingItemsQueryParams.parse(req.query);
  const limit = params.limit ?? 5;

  const rows = await db
    .select({
      menuItemId: orderItemsTable.menuItemId,
      name: orderItemsTable.menuItemName,
      totalQuantity: sql<number>`CAST(SUM(${orderItemsTable.quantity}) AS int)`,
      totalRevenue: sql<number>`SUM(${orderItemsTable.quantity} * ${orderItemsTable.unitPrice})`,
    })
    .from(orderItemsTable)
    .groupBy(orderItemsTable.menuItemId, orderItemsTable.menuItemName)
    .orderBy(sql`SUM(${orderItemsTable.quantity}) DESC`)
    .limit(limit);

  res.json(rows.map((r) => ({ ...r, totalRevenue: Math.round(Number(r.totalRevenue) * 100) / 100 })));
});

router.get("/dashboard/revenue-by-hour", async (_req, res) => {
  const { start, end } = todayRange();

  const rows = await db
    .select({
      hour: sql<number>`EXTRACT(HOUR FROM ${ordersTable.createdAt})::int`,
      revenue: sql<number>`SUM(CASE WHEN ${ordersTable.paymentStatus} = 'paid' THEN ${ordersTable.total} ELSE 0 END)`,
      orderCount: sql<number>`CAST(COUNT(*) AS int)`,
    })
    .from(ordersTable)
    .where(
      and(
        sql`${ordersTable.createdAt} >= ${start}`,
        sql`${ordersTable.createdAt} <= ${end}`
      )
    )
    .groupBy(sql`EXTRACT(HOUR FROM ${ordersTable.createdAt})`)
    .orderBy(sql`EXTRACT(HOUR FROM ${ordersTable.createdAt})`);

  res.json(rows.map((r) => ({ ...r, revenue: Math.round(Number(r.revenue) * 100) / 100 })));
});

router.get("/dashboard/orders-by-status", async (_req, res) => {
  const rows = await db
    .select({
      status: ordersTable.status,
      count: sql<number>`CAST(COUNT(*) AS int)`,
    })
    .from(ordersTable)
    .groupBy(ordersTable.status);

  res.json(rows);
});

export default router;
