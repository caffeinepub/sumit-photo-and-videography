// Local type definitions for Order management
// These types mirror the backend but are defined here since they're not exported from backend interface

export enum OrderStatus {
  Pending = 'Pending',
  Fulfilled = 'Fulfilled',
  Cancelled = 'Cancelled',
}

export interface OrderItem {
  itemName: string;
  quantity: bigint;
  unitPrice: bigint;
}

export interface PaymentFields {
  total: bigint;
  advance: bigint;
  remainingDue: bigint;
}

export interface Order {
  id: bigint;
  orderDate: bigint;
  fulfillDate: bigint;
  customerName: string;
  numberOfDvd: bigint;
  numberOfPrints: bigint;
  status: OrderStatus;
  payment: PaymentFields;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  orderDate: bigint;
  fulfillDate: bigint;
  customerName: string;
  numberOfDvd: bigint;
  numberOfPrints: bigint;
  payment: PaymentFields;
  items: OrderItem[];
}

export interface UpdateOrderRequest {
  fulfillDate?: bigint;
  customerName?: string;
  numberOfDvd?: bigint;
  numberOfPrints?: bigint;
  payment?: PaymentFields;
  items?: OrderItem[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// Time type (nanoseconds as bigint)
export type Time = bigint;
