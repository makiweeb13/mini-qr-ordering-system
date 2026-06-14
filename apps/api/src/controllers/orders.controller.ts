import type { Request, Response } from "express";
import { listOrders, createOrder, updateOrderPayment } from "../services/orders.service.js";

export async function getAll(_req: Request, res: Response) {
  const orders = await listOrders();
  res.json(orders);
}

export async function create(req: Request, res: Response) {
  try {
    const { customer, items } = req.body as {
      customer?: string;
      items: Array<{ productId: number; name: string; price: number; quantity: number }>;
    };
    const result = await createOrder(customer, items);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function updatePayment(req: Request, res: Response) {
  try {
    await updateOrderPayment(Number(req.params.id), req.body.paymentStatus);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}
