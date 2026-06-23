import { Router, type Router as RouterType } from "express";
import { auth } from "../lib/auth.js";
import { prisma } from "../prisma.js";

const seedRouter: RouterType = Router();

const products = [
  { name: "Chicken Adobo Rice", price: 159, category: "Rice Meals" },
  { name: "Pork Sinigang Rice", price: 169, category: "Rice Meals" },
  { name: "Beef Tapa Rice", price: 179, category: "Rice Meals" },
  { name: "Crispy Pata Rice", price: 199, category: "Rice Meals" },
  { name: "Lumpiang Shanghai (4 pcs)", price: 89, category: "Sides" },
  { name: "Turon (2 pcs)", price: 49, category: "Sides" },
  { name: "Garlic Rice", price: 39, category: "Sides" },
  { name: "Buko Pandan", price: 59, category: "Sides" },
  { name: "Iced Tea", price: 39, category: "Drinks" },
  { name: "Calamansi Juice", price: 49, category: "Drinks" },
  { name: "Buko Juice", price: 59, category: "Drinks" },
  { name: "Sago't Gulaman", price: 55, category: "Drinks" },
];

let seeded = { products: false, admin: false };

seedRouter.get("/", async (_req, res) => {
  try {
    const existing = await prisma.products.findFirst();
    if (!existing) {
      await prisma.products.createMany({ data: products });
      seeded.products = true;
    }
  } catch (err: unknown) {
    res.status(500).json({ error: "Product seed failed", detail: (err as Error).message });
    return;
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email: "admin@restaurant.com",
        password: "admin123",
        name: "Admin",
      },
    });
    seeded.admin = true;
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "status" in err &&
      (err as { status: number }).status === 422
    ) {
      // already exists — fine
    } else {
      res.status(500).json({ error: "Admin seed failed", detail: (err as Error).message });
      return;
    }
  }

  res.json({
    ok: true,
    message: seeded.products
      ? `Seeded ${products.length} menu items.`
      : "Menu items already exist, skipping.",
    admin: seeded.admin ? "Admin user created." : "Admin user already exists, skipping.",
  });
});

export default seedRouter;
