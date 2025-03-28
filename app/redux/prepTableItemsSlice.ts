import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderMenuType, OrderType } from 'app/api/services/orderService';
import { TableItem } from 'app/hooks/useTables';

const initialTableItem: TableItem = {
  id: 0,
  userId: 0,
  restaurantId: 0,
  tableName: '',
  totalPrice: 0,
  subTotal: 0,
  discountAmount: 0,
  date: '',
  orderType: OrderType.STORE,
  orderMenuType: OrderMenuType.NORMAL,
  orderItems: [],
  paymentInfo: [],
};

const prepTableItemsSlice = createSlice({
  name: 'prepTableItems',
  initialState: initialTableItem,
  reducers: {
    setPrepTableItems: (state, action: PayloadAction<TableItem>) => {
      return action.payload;
    },
    resetPrepTableItems: () => {
      return initialTableItem;
    },
  },
});

export const { setPrepTableItems, resetPrepTableItems } = prepTableItemsSlice.actions;
export default prepTableItemsSlice.reducer;
