// Money is stored/computed in the smallest safe unit (millimes-free decimal) using
// integer cents internally to avoid floating point drift, then formatted for display.

export function toCents(amount: number): number {
  return Math.round(amount * 1000);
}

export function fromCents(cents: number): number {
  return cents / 1000;
}

export function sumMoney(values: number[]): number {
  const cents = values.reduce((acc, v) => acc + toCents(v), 0);
  return fromCents(cents);
}

export function formatMoney(amount: number, currency = 'DT'): string {
  const rounded = Math.round(amount * 1000) / 1000;
  const formatted = rounded.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  return `${formatted} ${currency}`;
}

export function percentOf(amount: number, percent: number): number {
  return fromCents(Math.round(toCents(amount) * (percent / 100)));
}
