import React from 'react';
import { useHasPermission } from './useHasPermission';
import { Permission } from './permission';

interface RequirePermissionProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  fallback = null,
  children,
}) => (useHasPermission(permission) ? <>{children}</> : <>{fallback}</>);
