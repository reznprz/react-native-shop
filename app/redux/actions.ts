import { createAction } from '@reduxjs/toolkit';

/**
 * A special action that instructs our root reducer to clear the entire store.
 */
export const logoutAll = createAction('auth/logoutAll');
