import { prisma } from "../prisma.js";
import { toNumber, formatOrderId } from "../utils/format.js";
import { PAYMENT_STATUSES } from "../config/constants.js";

function formatOrder(o: {
  id: number;
  customer: string;
  paymentStatus: string;
  total: { toNumber: () => number } | number;
  createdAt: Date;
  order_items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: { toNumber: () => number } | number;
  }>;
}) {
  return {
    id: formatOrderId(o.id),
    customer: o.customer,
    items: o.order_items.map(i => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: toNumber(i.price),
    })),
    total: toNumber(o.total),
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt.toISOString(),
  };
}

export async function listOrders() {
  const orders = await prisma.orders.findMany({
    orderBy: { createdAt: "desc" },
    include: { order_items: true },
  });
  return orders.map(formatOrder);
}

export async function createOrder(
  customer: string | undefined,
  items: Array<{ productId: number; name: string; price: number; quantity: number }>,
) {
  if (!items || items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await prisma.orders.create({
    data: {
      customer: customer || "Walk-in",
      total,
      order_items: {
        create: items.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      },
    },
  });

  return {
    id: formatOrderId(order.id),
    total,
    paymentStatus: "unpaid",
  };
}

export async function updateOrderPayment(id: number, paymentStatus: string) {
  if (!PAYMENT_STATUSES.includes(paymentStatus as typeof PAYMENT_STATUSES[number])) {
    throw new Error("Invalid payment status");
  }
  await prisma.orders.update({ where: { id }, data: { paymentStatus } });
}
