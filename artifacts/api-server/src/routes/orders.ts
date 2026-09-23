import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, ordersTable, orderItemsTable, menuItemsTable } from "@workspace/db";
import {
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderStatusBody,
  UpdateOrderStatusParams,
  UpdateOrderPaymentBody,
  UpdateOrderPaymentParams,
  ListOrdersQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeOrder(order: typeof ordersTable.$inferSelect) {
  return { ...order, total: Number(order.total) };
}

function serializeOrderItem(item: typeof orderItemsTable.$inferSelect) {
  return { ...item, unitPrice: Number(item.unitPrice) };
}

async function getOrderWithItems(id: number) {
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id));
  if (!order) return null;

  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, id));

  return { ...serializeOrder(order), items: items.map(serializeOrderItem) };
}

router.get("/orders", async (req, res) => {
  const params = ListOrdersQueryParams.parse(req.query);
  const conditions = [];

  if (params.status) conditions.push(eq(ordersTable.status, params.status));
  if (params.type) conditions.push(eq(ordersTable.type, params.type));
  if (params.paymentStatus) conditions.push(eq(ordersTable.paymentStatus, params.paymentStatus));
  if (params.date) {
    const start = new Date(params.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(params.date);
    end.setHours(23, 59, 59, 999);
    conditions.push(sql`${ordersTable.createdAt} >= ${start} AND ${ordersTable.createdAt} <= ${end}`);
  }

  const orders = await db
    .select()
    .from(ordersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(sql`${ordersTable.createdAt} DESC`);

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await db
        .select()
        .from(orderItemsTable)
        .where(eq(orderItemsTable.orderId, order.id));
      return { ...serializeOrder(order), items: items.map(serializeOrderItem) };
    })
  );

  res.json(ordersWithItems);
});

router.post("/orders", async (req, res) => {
  const body = CreateOrderBody.parse(req.body);

  const menuItems = await db
    .select()
    .from(menuItemsTable)
    .where(
      sql`${menuItemsTable.id} = ANY(ARRAY[${sql.join(
        body.items.map((i) => sql`${i.menuItemId}`),
        sql`, `
      )}]::int[])`
    );

  const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

  let total = 0;
  for (const item of body.items) {
    const menuItem = menuItemMap.get(item.menuItemId);
    if (!menuItem) {
      res.status(400).json({ error: `Menu item ${item.menuItemId} not found` });
      return;
    }
    total += Number(menuItem.price) * item.quantity;
  }

  const [order] = await db
    .insert(ordersTable)
    .values({
      type: body.type,
      customerName: body.customerName ?? null,
      tableNumber: body.tableNumber ?? null,
      notes: body.notes ?? null,
      total: total.toFixed(2),
      status: "new",
      paymentStatus: "unpaid",
    })
    .returning();

  const itemRows = body.items.map((item) => {
    const menuItem = menuItemMap.get(item.menuItemId)!;
    return {
      orderId: order.id,
      menuItemId: item.menuItemId,
      menuItemName: menuItem.name,
      quantity: item.quantity,
      unitPrice: menuItem.price,
    };
  });

  await db.insert(orderItemsTable).values(itemRows);

  const result = await getOrderWithItems(order.id);
  res.status(201).json(result);
});

router.get("/orders/:id", async (req, res) => {
  const { id } = GetOrderParams.parse(req.params);
  const result = await getOrderWithItems(id);
  if (!result) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(result);
});

router.patch("/orders/:id/status", async (req, res) => {
  const { id } = UpdateOrderStatusParams.parse(req.params);
  const body = UpdateOrderStatusBody.parse(req.body);

  const [order] = await db
    .update(ordersTable)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(ordersTable.id, id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const result = await getOrderWithItems(id);
  res.json(result);
});

router.patch("/orders/:id/payment", async (req, res) => {
  const { id } = UpdateOrderPaymentParams.parse(req.params);
  const body = UpdateOrderPaymentBody.parse(req.body);

  const [order] = await db
    .update(ordersTable)
    .set({ paymentStatus: "paid", paymentMethod: body.paymentMethod, updatedAt: new Date() })
    .where(eq(ordersTable.id, id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const result = await getOrderWithItems(id);
  res.json(result);
});

export default router;
