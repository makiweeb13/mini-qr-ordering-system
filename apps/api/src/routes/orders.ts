import { Router, type Router as RouterType } from "express";
import { pool } from "../db.js";

const router: RouterType = Router();

router.get("/", async (_req, res) => {
  const [orders] = await pool.query(
    `SELECT id, customer, status, paymentStatus, total, createdAt
     FROM orders ORDER BY createdAt DESC`
  );

  const orderIds = (orders as { id: number }[]).map(o => o.id);
  if (orderIds.length === 0) return res.json([]);

  const placeholders = orderIds.map(() => "?").join(",");
  const [items] = await pool.query(
    `SELECT id, orderId, productId, name, price, quantity
     FROM order_items WHERE orderId IN (${placeholders})`,
    orderIds
  );

  const typedItems = items as Array<{ id: number; orderId: number; productId: number; name: string; price: number; quantity: number }>;
  const itemsByOrder: Record<number, typeof typedItems> = {};
  for (const item of typedItems) {
    if (!itemsByOrder[item.orderId]) itemsByOrder[item.orderId] = [];
    itemsByOrder[item.orderId]!.push(item);
  }

  const result = (orders as Array<{
    id: number;
    customer: string;
    status: string;
    paymentStatus: string;
    total: number;
    createdAt: string;
  }>).map(o => ({
    id: `ORD-${String(o.id).padStart(3, "0")}`,
    customer: o.customer,
    items: itemsByOrder[o.id] || [],
    total: o.total,
    status: o.status,
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt,
  }));

  res.json(result);
});

router.post("/", async (req, res) => {
  const { customer, items } = req.body as {
    customer?: string;
    items: Array<{ productId: number; name: string; price: number; quantity: number }>;
  };

  if (!items || items.length === 0) {
    res.status(400).json({ error: "Order must have at least one item" });
    return;
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      "INSERT INTO orders (customer, total) VALUES (?, ?)",
      [customer || "Walk-in", total]
    );
    const orderId = (orderResult as { insertId: number }).insertId;

    const values = items.map(i => [orderId, i.productId, i.name, i.price, i.quantity]);
    await conn.query(
      "INSERT INTO order_items (orderId, productId, name, price, quantity) VALUES ?",
      [values]
    );

    await conn.commit();

    const id = `ORD-${String(orderId).padStart(3, "0")}`;
    res.status(201).json({ id, total, status: "pending", paymentStatus: "unpaid" });
  } catch (err) {
    await conn.rollback();
    console.error("Order creation failed:", err);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    conn.release();
  }
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body as { status: string };
  const validStatuses = ["pending", "paid", "preparing", "completed"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
  res.json({ ok: true });
});

router.patch("/:id/payment", async (req, res) => {
  const { paymentStatus } = req.body as { paymentStatus: string };
  const validStatuses = ["unpaid", "paid", "refunded"];
  if (!validStatuses.includes(paymentStatus)) {
    res.status(400).json({ error: "Invalid payment status" });
    return;
  }
  await pool.query("UPDATE orders SET paymentStatus = ? WHERE id = ?", [paymentStatus, req.params.id]);
  res.json({ ok: true });
});

export default router;
