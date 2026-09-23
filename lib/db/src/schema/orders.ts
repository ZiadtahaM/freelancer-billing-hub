import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().$type<"online" | "in_person">(),
  customerName: text("customer_name"),
  tableNumber: integer("table_number"),
  status: text("status").notNull().default("new").$type<"new" | "preparing" | "ready" | "completed" | "cancelled">(),
  paymentStatus: text("payment_status").notNull().default("unpaid").$type<"unpaid" | "paid">(),
  paymentMethod: text("payment_method").$type<"cash" | "card" | "online">(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
