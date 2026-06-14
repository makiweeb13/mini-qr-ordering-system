import type { Request, Response } from "express";
import { listProducts } from "../services/products.service.js";

export async function getAll(_req: Request, res: Response) {
  const products = await listProducts();
  res.json(products);
}
