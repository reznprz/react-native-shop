export type ApiAction<T> =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_FAILURE'; error: string }
  | { type: 'RESET' };

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Generic reducer function
export const apiReducer = <T>(state: ApiState<T>, action: ApiAction<T>): ApiState<T> => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'RESET':
      return getInitialApiState<T>();
    default:
      throw new Error('Unhandled action type');
  }
};

// Initial state factory function
export const getInitialApiState = <T>(): ApiState<T> => ({
  data: null,
  loading: false,
  error: null,
});
