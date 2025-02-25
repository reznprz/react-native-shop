import { useState } from 'react';

export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

export type OrderDetails = {
  id: number;
  table: string;
  date: string;
  time: string;
  status: string;
  total: number;
  paymentMethod: 'Credit Card' | 'Esewa' | 'Cash' | 'FonePay';
  items: OrderItem[];
};

export const useOrder = () => {
  const [orders] = useState<OrderDetails[]>([
    {
      id: 1234,
      table: 'Table 12',
      date: '06 15, 2025',
      time: '7:30 PM',
      status: 'Completed',
      total: 84.5,
      paymentMethod: 'Credit Card',
      items: [
        { id: 1, name: 'Margherita Pizza', quantity: 2, price: 32.0 },
        { id: 2, name: 'Caesar Salad', quantity: 1, price: 12.5 },
        { id: 3, name: 'Soft Drinks', quantity: 3, price: 9.0 },
        { id: 5, name: 'Tiramisu', quantity: 1, price: 8.0 },
        { id: 6, name: 'Soft Drinks', quantity: 3, price: 9.0 },
        { id: 7, name: 'Tiramisu', quantity: 1, price: 8.0 },
      ],
    },
    {
      id: 1233,
      table: 'Table 5',
      date: 'March 16, 2025',
      time: '8:00 PM',
      status: 'Pending',
      total: 50.0,
      paymentMethod: 'Cash',
      items: [
        { id: 5, name: 'Pepperoni Pizza', quantity: 1, price: 20.0 },
        { id: 6, name: 'Pasta Alfredo', quantity: 1, price: 15.0 },
        { id: 7, name: 'Soft Drink', quantity: 2, price: 10.0 },
        { id: 8, name: 'Cheesecake', quantity: 1, price: 5.0 },
      ],
    },
    {
      id: 1222,
      table: 'Table 5',
      date: 'March 16, 2025',
      time: '8:00 PM',
      status: 'Pending',
      total: 50.0,
      paymentMethod: 'Cash',
      items: [
        { id: 5, name: 'Pepperoni Pizza', quantity: 1, price: 20.0 },
        { id: 6, name: 'Pasta Alfredo', quantity: 1, price: 15.0 },
        { id: 7, name: 'Soft Drink', quantity: 2, price: 10.0 },
        { id: 8, name: 'Cheesecake', quantity: 1, price: 5.0 },
      ],
    },
    {
      id: 1237,
      table: 'Table 5',
      date: 'March 16, 2025',
      time: '8:00 PM',
      status: 'Pending',
      total: 50.0,
      paymentMethod: 'Esewa',
      items: [
        { id: 5, name: 'Pepperoni Pizza', quantity: 1, price: 20.0 },
        { id: 6, name: 'Pasta Alfredo', quantity: 1, price: 15.0 },
        { id: 7, name: 'Soft Drink', quantity: 2, price: 10.0 },
        { id: 8, name: 'Cheesecake', quantity: 1, price: 5.0 },
      ],
    },
    {
      id: 1239,
      table: 'Table 5',
      date: 'March 16, 2025',
      time: '8:00 PM',
      status: 'Pending',
      total: 50.0,
      paymentMethod: 'FonePay',
      items: [
        { id: 5, name: 'Pepperoni Pizza', quantity: 1, price: 20.0 },
        { id: 6, name: 'Pasta Alfredo', quantity: 1, price: 15.0 },
        { id: 7, name: 'Soft Drink', quantity: 2, price: 10.0 },
        { id: 8, name: 'Cheesecake', quantity: 1, price: 5.0 },
      ],
    },
  ]);

  return { orders };
};
