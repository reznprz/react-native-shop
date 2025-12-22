import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableItem } from 'app/hooks/useTables';

export enum OrderType {
  ONLINE = 'ONLINE',
  STORE = 'STORE',
  TAKEOUT = 'TAKEOUT',
  FOODMANDU = 'FOODMANDU',
}

export enum OrderMenuType {
  NORMAL = 'NORMAL',
  TOURIST = 'TOURIST',
}

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

/** Utility that every reducer can reuse */
const recalcTotals = (draft: TableItem) => {
  draft.subTotal = draft.orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  draft.totalPrice = draft.subTotal - draft.discountAmount;
};

const prepTableItemsSlice = createSlice({
  name: 'prepTableItems',
  initialState: initialTableItem,
  reducers: {
    setPrepTableItems: (state, action: PayloadAction<Partial<TableItem>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetPrepTableItems: () => {
      return initialTableItem;
    },
    applyDiscount(state, action: PayloadAction<number>) {
      state.discountAmount = action.payload;
      recalcTotals(state);
    },
    updateTableName(state, action: PayloadAction<string>) {
      state.tableName = action.payload;
    },
  },
});

export const { setPrepTableItems, resetPrepTableItems, applyDiscount, updateTableName } =
  prepTableItemsSlice.actions;
export default prepTableItemsSlice.reducer;
