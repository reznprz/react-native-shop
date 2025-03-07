import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderType } from 'app/api/services/orderService';
import { TableItem } from 'app/hooks/useTables';

const initialTableItem: TableItem = {
  id: 0,
  userId: 0,
  restaurantId: 0,
  tableName: '',
  totalPrice: 0,
  subTotal: 0,
  discountAmount: 0,
  orderType: OrderType.STORE,
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
