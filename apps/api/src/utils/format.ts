export function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "toNumber" in (value as object)) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

export function formatOrderId(id: number): string {
  return `ORD-${String(id).padStart(3, "0")}`;
}
