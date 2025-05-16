import React, { useRef, useEffect, useCallback, createContext, ReactNode } from 'react';
import { TouchableWithoutFeedback, AppState, AppStateStatus } from 'react-native';
import { useDispatch } from 'react-redux';
import { clearAuthData } from 'app/redux/authSlice';

interface InactivityContextType {
  resetTimer: () => void;
}
export const InactivityContext = createContext<InactivityContextType>({
  resetTimer: () => {},
});

/**
 * Provider that triggers auto-logout after 5 minutes of no user interaction.
 * Wrap your app with this at the top level.
 */
export function InactivityProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const timer = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    console.log('Logging out due to inactivity');
    dispatch(clearAuthData());
  }, [dispatch]);

  const resetTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(logout, 5 * 60 * 1000); // 5 minutes
  }, [logout]);

  // start timer on mount
  useEffect(() => {
    resetTimer();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [resetTimer]);

  // optionally reset on app foreground
  useEffect(() => {
    const onChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') resetTimer();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => {
      sub.remove();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [resetTimer]);

  return (
    <InactivityContext.Provider value={{ resetTimer }}>
      <TouchableWithoutFeedback onPress={resetTimer}>{children}</TouchableWithoutFeedback>
    </InactivityContext.Provider>
  );
}
