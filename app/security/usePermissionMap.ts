import { Permission } from './permission';
import { useHasPermission } from './useHasPermission';

/**
 * Given a map of your own keys → Permission,
 * returns the same keys → boolean.
 */
export function usePermissionMap<K extends string>(
  mapping: Record<K, Permission>,
): Record<K, boolean> {
  // We call hooks in a stable order by iterating over Object.entries(mapping)
  const entries = Object.entries(mapping) as [K, Permission][];
  const result = {} as Record<K, boolean>;
  for (const [key, perm] of entries) {
    // each call to useHasPermission is in the same order every render
    result[key] = useHasPermission(perm);
  }
  return result;
}
