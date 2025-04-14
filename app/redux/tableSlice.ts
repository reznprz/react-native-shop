import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableState {
  tableName: string;
  tableId: number;
}

const initialState: TableState = {
  tableName: '',
  tableId: 0,
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
  },
});

export const { setTableName, setTableID } = tableSlice.actions;
export default tableSlice.reducer;
