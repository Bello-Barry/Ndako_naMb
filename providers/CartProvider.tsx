import { CartItem, Tables } from '@/types';

import { PropsWithChildren,useEffect, createContext, useContext, useState } from 'react';
//import { randomUUID } from 'expo-crypto' ;
//import { useInsertOrder } from '@/api/orders';
import { useRouter } from 'expo-router';
//import { useInsertOrderItems } from '@/api/order-items';
//import { initialisePaymentSheet, openPaymentSheet } from '@/lib/stripe';

type annonce = Tables<'annonce'>;

type CartType = {
  items: CartItem[];
  addItem: (annonce: annonce) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  //checkout: () => void;
};

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  //checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  //const { mutate: insertOrder } = useInsertOrder();
  //const { mutate: insertOrderItems } = useInsertOrderItems();

  const router = useRouter();

  const addItem = (annonce: annonce) => {
    // if already in cart, increment quantity
    const existingItem = items.find(
      (item) => item.annonce === annonce
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem: CartItem = {
       id:randomUUID(), // generate
      annonce,

      annonce_id: annonce.id,
     
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
  };

  // updateQuantity
  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems(
      items
        .map((item) =>
          item.id !== itemId
            ? item
            : { ...item, quantity: item.quantity + amount }
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = items.reduce(
    (sum, item) => (sum += item.annonce.regularPrice * item.quantity),
    0
  );

  const clearCart = () => {
    setItems([]);
  };

  {/*const checkout = async () => {
    await initialisePaymentSheet(Math.floor(total * 100));
    const payed = await openPaymentSheet();
    if (!payed) {
      return;
    }

    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      }
    );
  };*/}

 const saveOrderItems = (order: Tables<'orders'>) => {
    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      annonce_id: cartItem.annonce_id,
     
    }));

    {/*insertOrderItems(orderItems, {
      onSuccess() {
        clearCart();
        router.push(`/(user)/orders/${order.id}`);
      },
    });
 
checkout
*/}
};

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, total, }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);

function randomUUID(): string {
  throw new Error('Function not implemented.');
}
