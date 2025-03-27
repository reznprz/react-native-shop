import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { store } from 'app/redux/store';
import { logoutAll } from 'app/redux/actions';

/**
 * Hook that automatically logs the user out after `timeoutMs` of inactivity.
 * It tracks app foreground/background changes. By default, 5 minutes.
 */
export function useInactivityLogout(timeoutMs: number = 5 * 60 * 1000) {
  const lastActiveRef = useRef(Date.now());
  const appStateRef = useRef(AppState.currentState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Resets the inactivity timer to zero. If no further resets occur
   * within `timeoutMs`, we dispatch `logoutAll()`.
   */
  const resetTimer = useCallback(() => {
    lastActiveRef.current = Date.now();

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Start a new timer
    timerRef.current = setTimeout(() => {
      const now = Date.now();
      if (now - lastActiveRef.current >= timeoutMs) {
        // Time’s up -> force logout
        store.dispatch(logoutAll());
      }
    }, timeoutMs);
  }, [timeoutMs]);

  // Track when the app goes to background or returns to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Start the timer on mount
    resetTimer();

    return () => {
      subscription.remove();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resetTimer]);

  /** Callback whenever app state changes (background <-> foreground) */
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    const prevState = appStateRef.current;
    appStateRef.current = nextAppState;

    // If we come back to active state, reset inactivity timer
    if (prevState?.match(/inactive|background/) && nextAppState === 'active') {
      resetTimer();
    }
  };

  return {
    resetTimer,
  };
}

/**
 * A small helper hook that just exposes a function `onAnyTouch` for resetting the timer.
 * You can attach `onAnyTouch` to a Pressable or top-level wrapper in your app
 * to catch user interactions and call `resetTimer`.
 */
export function useResetTimerOnTouch() {
  const { resetTimer } = useInactivityLogout();

  /**
   * Attach me to onPress or onTouchStart, for instance.
   */
  const onAnyTouch = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  return { onAnyTouch };
}
