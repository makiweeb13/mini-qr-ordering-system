import { prisma } from "../prisma.js";

export async function listProducts() {
  return prisma.products.findMany({
    orderBy: [{ category: "asc" }, { id: "asc" }],
    select: { id: true, name: true, price: true, category: true },
  });
}
