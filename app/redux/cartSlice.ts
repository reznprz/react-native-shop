import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  imageUrl?: string;
  orderItemId: number;
  productName: string;
  quantity: number;
  price: number;
  priceInKg?: number;
  unitInKg?: number;
  createdAt: string;
  updatedAt: string;
  totalPrice: number;
}

export interface PaymentInfo {
  paymentType: string;
  debitAmount: number;
  creditAmount: number;
  totalAmount: number;
  discountAmount: number;
  subTotal: number;
  paymentStatus: string;
}

export interface PrepCartItemDetail {
  orderId: number;
  cartItems: OrderItem[];
  selectedTable: string;
  discountAmount: number;
  subTotal: number;
  totalAmount: number;
  paymentInfo: PaymentInfo;
}

export const initialPrepCartItemDetail: PrepCartItemDetail = {
  orderId: 0,
  cartItems: [],
  selectedTable: '',
  discountAmount: 0,
  subTotal: 0,
  totalAmount: 0,
  paymentInfo: {
    paymentType: '',
    debitAmount: 0,
    creditAmount: 0,
    totalAmount: 0,
    discountAmount: 0,
    subTotal: 0,
    paymentStatus: '',
  },
};

const cartSlice = createSlice({
  name: 'prepCart',
  initialState: initialPrepCartItemDetail,
  reducers: {
    // Replace the entire cart state
    setPrepCartItemDetail(_state, action: PayloadAction<PrepCartItemDetail>) {
      return action.payload;
    },
    // Update parts of the cart state using Object.assign to avoid returning a new object
    updatePrepCartItemDetail(state, action: PayloadAction<Partial<PrepCartItemDetail>>) {
      Object.assign(state, action.payload);
    },
    // Reset the cart state to its initial value
    resetPrepCartItemDetail() {
      return initialPrepCartItemDetail;
    },
    // Add a new item, update an existing one, or remove it if quantity is 0
    modifyCartItem(state, action: PayloadAction<OrderItem>) {
      const incomingItem = action.payload;
      const index = state.cartItems.findIndex(
        (item) => item.orderItemId === incomingItem.orderItemId,
      );

      if (index !== -1) {
        if (incomingItem.quantity <= 0) {
          // Remove the item if quantity is 0 or less
          state.cartItems.splice(index, 1);
        } else {
          // Update the existing item
          state.cartItems[index] = {
            ...state.cartItems[index],
            ...incomingItem,
            totalPrice: incomingItem.quantity * incomingItem.price,
            updatedAt: new Date().toISOString(),
          };
        }
      } else {
        if (incomingItem.quantity > 0) {
          state.cartItems.push({
            ...incomingItem,
            totalPrice: incomingItem.quantity * incomingItem.price,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    },
  },
});

export const {
  setPrepCartItemDetail,
  updatePrepCartItemDetail,
  resetPrepCartItemDetail,
  modifyCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;
