import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/store';
import { ROLE_PERMISSIONS } from './policyMatrix';
import { Permission } from './permission';
import { Role } from './role';

export function useHasPermission(p: Permission): boolean {
  const accessLevel = useSelector((s: RootState) => s.auth.authData?.accessLevel);
  // cast your Redux-level string to your Role enum
  const role = (accessLevel as Role) ?? Role.STAFF;

  // look up the array (might be undefined if you typo’ed the Role key!)
  const allowed = ROLE_PERMISSIONS[role];
  if (!allowed) {
    // no entry in the matrix? deny by default
    return false;
  }
  return allowed.includes(p);
}
