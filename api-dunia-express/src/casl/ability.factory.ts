import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, type DrizzleDB } from '../database/database.constants.js';
import { users } from '../database/schema/users.schema.js';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { roll } from '../database/schema/roll.schema.js';
import { rollJunction } from '../database/schema/roll-junction.schema.js';
import { permission } from '../database/schema/permission.schema.js';

export enum Action {
  Manage = 'manage',
  Access = 'access',
}

export type Subjects = 'all' | 'ecommerce' | 'diamond_topup' | (string & {});

export type AppAbility = MongoAbility<
  [Action | `${Action}` | string, Subjects]
>;

@Injectable()
export class CaslAbilityFactory {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async createForUser(userId: string) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    const [user] = await this.db
      .select({
        id: users.id,
        rollName: roll.name,
        permissions: sql<
          {
            id: string;
            moduleName: string;
          }[]
        >`
          COALESCE(
            jsonb_agg(
              DISTINCT jsonb_build_object(
                'id', ${permission.id},
                'moduleName', ${permission.moduleName}
              )
            ) FILTER (WHERE ${permission.id} IS NOT NULL),
            '[]'::jsonb
          )
        `.as('permissions'),
      })
      .from(users)
      .leftJoin(roll, eq(users.roll, roll.id))
      .leftJoin(rollJunction, eq(roll.id, rollJunction.rollId))
      .leftJoin(permission, eq(permission.id, rollJunction.permissionId))
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .groupBy(users.id, roll.name)
      .limit(1);

    if (!user || !user.rollName) {
      return build();
    }

    const roleName = user.rollName.toLowerCase();

    // Preserve full access for super admin / owner
    if (roleName === 'admin' || roleName === 'owner') {
      can(Action.Manage, 'all');
      can(Action.Access, 'all');
      return build();
    }

    const isEcommerceAdmin =
      roleName === 'ecommerce' ||
      roleName === 'ecommerce_admin' ||
      roleName === 'ecommerce admin' ||
      roleName.includes('ecommerce');

    // E-commerce admin: full access to all E-commerce operations automatically without separate permissions
    if (isEcommerceAdmin) {
      can(Action.Manage, 'ecommerce');
      can(Action.Access, 'ecommerce');

      // The E-commerce admin must not access diamond_topup
      cannot(Action.Access, 'diamond_topup');
      cannot(Action.Manage, 'diamond_topup');
      return build();
    }

    const isDiamondTopUpAdmin =
      roleName === 'diamond_topup' ||
      roleName === 'diamond_topup_admin' ||
      roleName === 'diamond_topup admin' ||
      roleName.includes('diamond_topup');

    if (isDiamondTopUpAdmin) {
      can(Action.Manage, 'diamond_topup');
      can(Action.Access, 'diamond_topup');

      // The diamond topup admin must not access ecommerce
      cannot(Action.Access, 'ecommerce');
      cannot(Action.Manage, 'ecommerce');
      return build();
    }

    // Preserve existing permissions for other roles
    if (user.permissions && Array.isArray(user.permissions)) {
      for (const perm of user.permissions) {
        if (!perm.moduleName) continue;
        const module = perm.moduleName.toLowerCase();

        // If another role has access to E-commerce, grant full access to E-commerce operations automatically
        if (module === 'ecommerce') {
          can(Action.Manage, 'ecommerce');
          can(Action.Access, 'ecommerce');
        } else {
          can(Action.Access, perm.moduleName);
        }
      }
    }

    return build();
  }
}
