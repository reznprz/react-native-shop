import { Permission } from './permission';
import { Role } from './role';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission), // full access

  [Role.STAFF]: [Permission.VIEW_DAILY_METRICS],
};
