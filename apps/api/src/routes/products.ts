import { Router, type Router as RouterType } from "express";
import { pool } from "../db.js";

const router: RouterType = Router();

router.get("/", async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT id, name, price, category FROM products ORDER BY category, id"
  );
  res.json(rows);
});

export default router;
