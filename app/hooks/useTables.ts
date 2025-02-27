import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { modifyCartItem, OrderItem } from '../redux/cartSlice';
import { Food } from 'app/api/services/foodService';

export function useTables() {
  const dispatch: AppDispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const updateCartItemForFood = (food: Food, newQuantity: number) => {
    const orderItem = {
      orderItemId: 0,
      productName: food.name,
      quantity: newQuantity,
      price: food.price,
      createdAt: '',
      updatedAt: '',
      totalPrice: food.price * newQuantity,
    };

    dispatch(
      modifyCartItem({
        ...orderItem,
        quantity: newQuantity,
        totalPrice: newQuantity * orderItem.price,
        updatedAt: new Date().toISOString(),
      }),
    );
  };

  const updateCartItemForOrderItem = (orderItem: OrderItem, newQuantity: number) => {
    dispatch(
      modifyCartItem({
        ...orderItem,
        quantity: newQuantity,
        totalPrice: newQuantity * orderItem.price,
        updatedAt: new Date().toISOString(),
      }),
    );
  };
  // Mock data for demonstration
  const [tables] = useState([
    { name: 'Table B2', status: 'occupied', seats: 6, items: 8 },
    { name: 'Table A1', status: 'available', seats: 4, items: 3 },
    { name: 'Table C3', status: 'available', seats: 2, items: 1 },
    { name: 'Table D4', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table E4', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table F4', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table G4', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table B3', status: 'occupied', seats: 6, items: 8 },
    { name: 'Table A3', status: 'available', seats: 4, items: 3 },
    { name: 'Table C4', status: 'available', seats: 2, items: 1 },
    { name: 'Table D6', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table E9', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table F5', status: 'occupied', seats: 8, items: 6 },
    { name: 'Table G1', status: 'occupied', seats: 8, items: 6 },
  ]);

  // Memoized calculations
  const totalTables = useMemo(() => tables.length, [tables]);

  const availableTables = useMemo(() => {
    return tables.filter((table) => table.status === 'available').length;
  }, [tables]);

  const occupiedTables = useMemo(() => {
    return tables.filter((table) => table.status === 'occupied').length;
  }, [tables]);

  const totalCapacity = useMemo(() => {
    return tables.reduce((sum, table) => sum + table.seats, 0);
  }, [tables]);

  const activeOrders = useMemo(() => {
    return tables.reduce((sum, table) => sum + table.items, 0);
  }, [tables]);

  const tableNames = useMemo<string[]>(() => tables.map((table) => table.name), [tables]);

  return {
    tables,
    totalTables,
    availableTables,
    occupiedTables,
    totalCapacity,
    activeOrders,
    tableNames,
    cart,
    updateCartItemForFood,
    updateCartItemForOrderItem,
  };
}
