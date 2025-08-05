// utils/calculateTotals.ts
import { CartItem } from "../types/cartItem";

export const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.13; // 13% tax
  const total = subtotal + tax;

  return {
    subtotal,
    tax,
    total,
  };
};
