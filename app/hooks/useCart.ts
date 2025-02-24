import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { modifyCartItem, OrderItem } from '../redux/cartSlice';
import { Food } from 'app/api/services/foodService';

export const useCart = () => {
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

  return { cart, updateCartItemForFood, updateCartItemForOrderItem };
};
