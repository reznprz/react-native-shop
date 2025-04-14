import { combineReducers } from '@reduxjs/toolkit';
import { logoutAll } from './actions';
import authReducer from './authSlice';
import foodReducer from './foodSlice';
import tableReducer from './tableSlice';
import prepTableItemReducer from './prepTableItemsSlice';

/**
 * Combine all slice reducers in the normal way.
 */
const appReducer = combineReducers({
  auth: authReducer,
  foods: foodReducer,
  table: tableReducer,
  prepTableItems: prepTableItemReducer,
});

/**
 * The root reducer checks if the action is "logoutAll". If yes,
 * it returns the initial state (by passing `undefined` to `appReducer`).
 */
export const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (logoutAll.match(action)) {
    // This resets all slices to their initial state
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof appReducer>;
