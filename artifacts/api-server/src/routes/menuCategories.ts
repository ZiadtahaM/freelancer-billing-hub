import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, menuCategoriesTable } from "@workspace/db";
import {
  CreateMenuCategoryBody,
  GetMenuCategoryParams,
  UpdateMenuCategoryBody,
  UpdateMenuCategoryParams,
  DeleteMenuCategoryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/menu-categories", async (req, res) => {
  const categories = await db
    .select()
    .from(menuCategoriesTable)
    .orderBy(menuCategoriesTable.sortOrder);
  res.json(categories);
});

router.post("/menu-categories", async (req, res) => {
  const body = CreateMenuCategoryBody.parse(req.body);
  const [category] = await db.insert(menuCategoriesTable).values(body).returning();
  res.status(201).json(category);
});

router.get("/menu-categories/:id", async (req, res) => {
  const { id } = GetMenuCategoryParams.parse(req.params);
  const [category] = await db
    .select()
    .from(menuCategoriesTable)
    .where(eq(menuCategoriesTable.id, id));
  if (!category) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(category);
});

router.put("/menu-categories/:id", async (req, res) => {
  const { id } = UpdateMenuCategoryParams.parse(req.params);
  const body = UpdateMenuCategoryBody.parse(req.body);
  const [category] = await db
    .update(menuCategoriesTable)
    .set(body)
    .where(eq(menuCategoriesTable.id, id))
    .returning();
  if (!category) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(category);
});

router.delete("/menu-categories/:id", async (req, res) => {
  const { id } = DeleteMenuCategoryParams.parse(req.params);
  await db.delete(menuCategoriesTable).where(eq(menuCategoriesTable.id, id));
  res.status(204).send();
});

export default router;
