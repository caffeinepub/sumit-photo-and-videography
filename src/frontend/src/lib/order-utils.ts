/**
 * Utility functions for Orders UI: safe BigInt parsing, validation, and payment calculations.
 */

/**
 * Safely parse a string to BigInt, returning 0n for invalid inputs
 */
export function parseBigIntSafe(value: string): bigint {
  if (!value || value.trim() === '') return 0n;
  try {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return 0n;
    return BigInt(num);
  } catch {
    return 0n;
  }
}

/**
 * Clamp a numeric input to non-negative values
 */
export function clampNonNegative(value: string): string {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 0) return '0';
  return num.toString();
}

/**
 * Calculate remaining due from total and advance
 */
export function calculateRemainingDue(total: bigint, advance: bigint): bigint {
  if (advance > total) return 0n;
  return total - advance;
}

/**
 * Format BigInt as currency (simple number format)
 */
export function formatCurrency(amount: bigint): string {
  return amount.toString();
}

/**
 * Calculate line item total (quantity * unitPrice)
 */
export function calculateLineTotal(quantity: bigint, unitPrice: bigint): bigint {
  return quantity * unitPrice;
}

/**
 * Calculate order subtotal from all line items
 */
export function calculateOrderSubtotal(items: Array<{ quantity: bigint; unitPrice: bigint }>): bigint {
  return items.reduce((sum, item) => sum + calculateLineTotal(item.quantity, item.unitPrice), 0n);
}
