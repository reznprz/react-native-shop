import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RestaurantTable } from 'app/api/services/tableService';

interface TableState {
  tableName: string;
  tableId: number;
  tables: RestaurantTable[];
}

const initialState: TableState = {
  tableName: '',
  tableId: 0,
  tables: [],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setTableName(state, action: PayloadAction<string>) {
      state.tableName = action.payload;
    },
    setTableID(state, action: PayloadAction<number>) {
      state.tableId = action.payload;
    },
    setTables(state, action: PayloadAction<RestaurantTable[]>) {
      state.tables = action.payload;
    },
    resetTables(state) {
      state.tables = [];
    },
  },
});

export const { setTableName, setTableID, setTables, resetTables } = tableSlice.actions;
export default tableSlice.reducer;
