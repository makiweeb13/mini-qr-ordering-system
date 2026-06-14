export const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"] as const;

export type PaymentStatus = typeof PAYMENT_STATUSES[number];
