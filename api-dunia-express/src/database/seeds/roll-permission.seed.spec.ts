import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  seedRolesAndPermissions,
  ensureTablesExist,
} from './roll-permission.seed.js';
import {
  DEFAULT_ROLES,
  DEFAULT_PERMISSIONS,
} from './roles-permissions.data.js';

describe('roll-permission.seed', () => {
  let mockDb: any;
  let mockLogger: any;

  beforeEach(() => {
    mockLogger = {
      log: vi.fn(),
      error: vi.fn(),
    };

    const mockRoles = DEFAULT_ROLES.map((r, index) => ({
      id: `role-uuid-${index + 1}`,
      name: r.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const mockPermissions = DEFAULT_PERMISSIONS.map((p, index) => ({
      id: `perm-uuid-${index + 1}`,
      moduleName: p.moduleName,
    }));

    const mockJunctions = [
      { id: 'junc-1', rollId: 'role-uuid-1', permissionId: 'perm-uuid-1' },
    ];

    let selectCallCount = 0;

    mockDb = {
      execute: vi.fn().mockResolvedValue(undefined),
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
        }),
      }),
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockImplementation(() => {
          selectCallCount++;
          if (selectCallCount % 3 === 1) {
            return Promise.resolve(mockRoles);
          } else if (selectCallCount % 3 === 2) {
            return Promise.resolve(mockPermissions);
          } else {
            return Promise.resolve(mockJunctions);
          }
        }),
      }),
    };
  });

  it('should ensure tables exist when ensureTables is true', async () => {
    await ensureTablesExist(mockDb);
    expect(mockDb.execute).toHaveBeenCalledTimes(1);
  });

  it('should seed roles, permissions, and junction relationships', async () => {
    const result = await seedRolesAndPermissions(mockDb, {
      ensureTables: true,
      logger: mockLogger,
    });

    expect(mockDb.execute).toHaveBeenCalledTimes(1);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(result.rolesCount).toBe(DEFAULT_ROLES.length);
    expect(result.permissionsCount).toBe(DEFAULT_PERMISSIONS.length);
    expect(result.roles).toEqual(DEFAULT_ROLES.map((r) => r.name));
    expect(result.permissions).toEqual(
      DEFAULT_PERMISSIONS.map((p) => p.moduleName),
    );
  });

  it('should skip ensureTablesExist when ensureTables is false', async () => {
    await seedRolesAndPermissions(mockDb, {
      ensureTables: false,
      logger: mockLogger,
    });

    expect(mockDb.execute).not.toHaveBeenCalled();
    expect(mockDb.insert).toHaveBeenCalled();
  });
});

