import { useReducer, useCallback } from "react";
import { PageState } from "../../types/PageState";

type Action =
  | { type: "SET_IDLE" }
  | { type: "SET_LOADING" }
  | { type: "SET_SUCCESS" }
  | { type: "SET_FAILURE"; payload?: any }
  | { type: "CLEAR_ERROR" }
  | { type: "RESET" }; // New action

interface State {
  current: PageState;
  error?: any;
}

const initialState: State = {
  current: PageState.IDLE,
  error: undefined,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_IDLE":
      return { current: PageState.IDLE, error: undefined };
    case "SET_LOADING":
      return { current: PageState.LOADING, error: undefined };
    case "SET_SUCCESS":
      return { current: PageState.SUCCESS, error: undefined };
    case "SET_FAILURE":
      return { current: PageState.FAILURE, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: undefined };
    case "RESET":
      return initialState; // Resets to initial state
    default:
      return state;
  }
}

export const usePageState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setIdle = useCallback(() => dispatch({ type: "SET_IDLE" }), []);
  const setLoading = useCallback(() => dispatch({ type: "SET_LOADING" }), []);
  const setSuccess = useCallback(() => dispatch({ type: "SET_SUCCESS" }), []);
  const setFailure = useCallback(
    (error?: any) => dispatch({ type: "SET_FAILURE", payload: error }),
    []
  );
  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);
  const resetPageState = useCallback(() => dispatch({ type: "RESET" }), []); // New reset function

  return {
    state: state.current,
    error: state.error,
    setIdle,
    setLoading,
    setSuccess,
    setFailure,
    clearError,
    resetPageState,
  };
};
