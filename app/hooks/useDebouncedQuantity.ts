import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { debounce } from 'lodash';

export function useDebouncedQuantity(
  externalQuantity: number,
  onUpdate: (newQuantity: number) => void,
  delay: number = 300,
) {
  const qty = useMemo(() => {
    return externalQuantity;
  }, [externalQuantity]);
  // Local state for immediate UI updates.
  const [tempQuantity, setTempQuantity] = useState(qty);

  // Ref to hold the last quantity sent to onUpdate.
  const lastSyncedQuantity = useRef(externalQuantity);

  // Sync the local state with externalQuantity (e.g. Redux state) only when it changes.
  useEffect(() => {
    if (externalQuantity !== tempQuantity) {
      setTempQuantity(externalQuantity);
      lastSyncedQuantity.current = externalQuantity;
    }
    // We intentionally omit tempQuantity from the dependency array here
    // because we want this effect to run only when externalQuantity changes.
  }, [externalQuantity]);

  // Create a debounced function that calls onUpdate if the quantity has changed.
  const debouncedUpdate = useCallback(
    debounce((newQty: number) => {
      if (newQty !== lastSyncedQuantity.current) {
        onUpdate(newQty);
        lastSyncedQuantity.current = newQty;
      }
    }, delay),
    [onUpdate, delay],
  );

  // Each time tempQuantity changes, schedule the debounced API update.
  useEffect(() => {
    debouncedUpdate(tempQuantity);
    return () => debouncedUpdate.cancel();
  }, [tempQuantity, debouncedUpdate]);

  // Handlers to update the local state (and hence UI) immediately.
  const handleIncrement = useCallback(() => setTempQuantity((q) => q + 1), []);
  const handleDecrement = useCallback(() => setTempQuantity((q) => (q > 0 ? q - 1 : 0)), []);

  return { tempQuantity, setTempQuantity, handleIncrement, handleDecrement };
}
