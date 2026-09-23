import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  let dbStatus = "ok";
  try {
    await db.execute(sql`SELECT 1`);
  } catch {
    dbStatus = "error";
  }

  const data = HealthCheckResponse.parse({
    status: dbStatus === "ok" ? "ok" : "degraded",
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });

  const httpStatus = dbStatus === "ok" ? 200 : 503;
  res.status(httpStatus).json(data);
});

export default router;
