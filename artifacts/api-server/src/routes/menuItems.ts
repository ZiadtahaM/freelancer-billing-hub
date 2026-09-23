import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, menuItemsTable, menuCategoriesTable } from "@workspace/db";
import {
  CreateMenuItemBody,
  GetMenuItemParams,
  UpdateMenuItemBody,
  UpdateMenuItemParams,
  DeleteMenuItemParams,
  ToggleMenuItemAvailabilityParams,
  ListMenuItemsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/menu-items", async (req, res) => {
  const params = ListMenuItemsQueryParams.parse(req.query);
  const conditions = [];
  if (params.categoryId !== undefined) {
    conditions.push(eq(menuItemsTable.categoryId, params.categoryId));
  }
  if (params.available !== undefined) {
    conditions.push(eq(menuItemsTable.isAvailable, params.available));
  }
  const items = await db
    .select()
    .from(menuItemsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
  res.json(items);
});

router.post("/menu-items", async (req, res) => {
  const body = CreateMenuItemBody.parse(req.body);
  const [item] = await db.insert(menuItemsTable).values(body).returning();
  res.status(201).json({ ...item, price: Number(item.price) });
});

router.get("/menu-items/:id", async (req, res) => {
  const { id } = GetMenuItemParams.parse(req.params);
  const [item] = await db
    .select()
    .from(menuItemsTable)
    .where(eq(menuItemsTable.id, id));
  if (!item) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ...item, price: Number(item.price) });
});

router.put("/menu-items/:id", async (req, res) => {
  const { id } = UpdateMenuItemParams.parse(req.params);
  const body = UpdateMenuItemBody.parse(req.body);
  const [item] = await db
    .update(menuItemsTable)
    .set(body)
    .where(eq(menuItemsTable.id, id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ...item, price: Number(item.price) });
});

router.delete("/menu-items/:id", async (req, res) => {
  const { id } = DeleteMenuItemParams.parse(req.params);
  await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id));
  res.status(204).send();
});

router.patch("/menu-items/:id/toggle-availability", async (req, res) => {
  const { id } = ToggleMenuItemAvailabilityParams.parse(req.params);
  const [existing] = await db
    .select()
    .from(menuItemsTable)
    .where(eq(menuItemsTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const [item] = await db
    .update(menuItemsTable)
    .set({ isAvailable: !existing.isAvailable })
    .where(eq(menuItemsTable.id, id))
    .returning();
  res.json({ ...item, price: Number(item.price) });
});

router.get("/public/menu", async (_req, res) => {
  const categories = await db
    .select()
    .from(menuCategoriesTable)
    .orderBy(menuCategoriesTable.sortOrder);

  const items = await db
    .select()
    .from(menuItemsTable)
    .where(eq(menuItemsTable.isAvailable, true));

  const result = categories.map((cat) => ({
    ...cat,
    items: items
      .filter((item) => item.categoryId === cat.id)
      .map((item) => ({ ...item, price: Number(item.price) })),
  }));

  res.json(result);
});

export default router;
