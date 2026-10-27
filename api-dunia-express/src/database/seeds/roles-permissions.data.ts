export interface RoleDefinition {
  name: string;
  description?: string;
}

export interface PermissionDefinition {
  moduleName: string;
  description?: string;
}

export const DEFAULT_ROLES: readonly RoleDefinition[] = [
  { name: 'admin', description: 'System Administrator with full access' },
  { name: 'owner', description: 'Business Owner with complete system privileges' },
  { name: 'manager', description: 'Operations & Service Manager' },
  { name: 'driver', description: 'Delivery & logistics agent' },
  { name: 'user', description: 'Standard consumer / customer' },
] as const;

export const DEFAULT_PERMISSIONS: readonly PermissionDefinition[] = [
  { moduleName: 'auth', description: 'Authentication and session management' },
  { moduleName: 'users', description: 'User account management' },
  { moduleName: 'roles', description: 'Role definitions management' },
  { moduleName: 'roll', description: 'Alternative alias for role management' },
  { moduleName: 'permissions', description: 'Permission configuration management' },
  { moduleName: 'permission', description: 'Alternative alias for permission management' },
  { moduleName: 'audit-logs', description: 'Security and system audit logs' },
  { moduleName: 'ecommerce', description: 'E-commerce products and catalog operations' },
  { moduleName: 'service', description: 'Courier & parcel services operations' },
  { moduleName: 'orders', description: 'Order processing and lifecycle management' },
  { moduleName: 'deliveries', description: 'Shipment and delivery tracking' },
  { moduleName: 'settings', description: 'System configuration and preferences' },
] as const;

export const ROLE_PERMISSIONS_MAP: Record<string, readonly string[]> = {
  admin: [
    'ecommerce',
  ]
};
