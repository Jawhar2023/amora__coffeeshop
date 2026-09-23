import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, CartItemOption } from '@/types';
import { uid } from '@/services/storage/storageService';
import { calcSubtotal, calcAddonsTotal } from '@/services/calculations/order';

interface AddToCartInput {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  options: CartItemOption[];
  notes: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (input: AddToCartInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  addonsTotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (input: AddToCartInput) => {
    setItems((prev) => [
      ...prev,
      {
        id: uid('line'),
        productId: input.productId,
        name: input.name,
        image: input.image,
        unitPrice: input.unitPrice,
        quantity: input.quantity,
        options: input.options,
        notes: input.notes,
      },
    ]);
  };

  const removeItem = (lineId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== lineId));
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === lineId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => calcSubtotal(items), [items]);
  const addonsTotal = useMemo(() => calcAddonsTotal(items), [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, addonsTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
