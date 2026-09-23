export function calcProfit(price: number, cost: number): number {
  return price - cost;
}

export function calcProfitMargin(price: number, cost: number): number {
  if (price <= 0) return 0;
  return ((price - cost) / price) * 100;
}
