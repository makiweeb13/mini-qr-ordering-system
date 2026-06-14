import "dotenv/config";
import { auth } from "./lib/auth.js";
import { prisma } from "./prisma.js";

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

async function seed() {
  try {
    const existing = await prisma.products.findFirst();
    if (!existing) {
      await prisma.products.createMany({ data: products });
      console.log(`Seeded ${products.length} menu items.`);
    } else {
      console.log("Menu items already exist, skipping.");
    }
  } catch (err: unknown) {
    console.error("Product seed failed:", err);
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email: "admin@restaurant.com",
        password: "admin123",
        name: "Admin",
      },
    });
    console.log("Admin user created (admin@restaurant.com / admin123)");
  } catch (err: unknown) {
    if (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 422) {
      console.log("Admin user already exists, skipping.");
    } else {
      console.error("Seed failed:", err);
    }
  } finally {
    process.exit(0);
  }
}

seed();
