import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, isNull, type SQL } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../database/database.constants.js';
import {
  categories,
  type Category,
  type NewCategory,
} from '../database/schema/index.js';
import { QueryCategoryDto } from './dto/query-category.dto.js';

export interface CategoryTreeItem extends Category {
  children: CategoryTreeItem[];
}

@Injectable()
export class CategoriesRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAll(
    query?: QueryCategoryDto,
    tx?: DrizzleDB,
  ): Promise<Category[]> {
    const client = tx ?? this.db;
    const conditions: SQL[] = [];

    if (query?.parentId !== undefined) {
      if (query.parentId === 'null' || query.parentId === '') {
        conditions.push(isNull(categories.parentId));
      } else {
        conditions.push(eq(categories.parentId, query.parentId));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return client
      .select()
      .from(categories)
      .where(whereClause)
      .orderBy(asc(categories.id));
  }

  async findById(id: string, tx?: DrizzleDB): Promise<Category | null> {
    const client = tx ?? this.db;
    const [cat] = await client
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    return cat ?? null;
  }

  async findChildren(parentId: string, tx?: DrizzleDB): Promise<Category[]> {
    const client = tx ?? this.db;
    return client
      .select()
      .from(categories)
      .where(eq(categories.parentId, parentId))
      .orderBy(asc(categories.id));
  }

  async create(data: NewCategory, tx?: DrizzleDB): Promise<Category> {
    const client = tx ?? this.db;
    const [created] = await client
      .insert(categories)
      .values(data)
      .returning();

    return created;
  }

  async update(
    id: string,
    data: Partial<NewCategory>,
    tx?: DrizzleDB,
  ): Promise<Category | null> {
    const client = tx ?? this.db;
    const [updated] = await client
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();

    return updated ?? null;
  }

  async delete(id: string, tx?: DrizzleDB): Promise<boolean> {
    const client = tx ?? this.db;
    const result = await client
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });

    return result.length > 0;
  }

  async isDescendantOf(
    candidateDescendantId: string,
    ancestorId: string,
    tx?: DrizzleDB,
  ): Promise<boolean> {
    if (candidateDescendantId === ancestorId) {
      return true;
    }

    const client = tx ?? this.db;
    let currentParentId: string | null = candidateDescendantId;
    const visited = new Set<string>();

    while (currentParentId) {
      if (currentParentId === ancestorId) {
        return true;
      }
      if (visited.has(currentParentId)) {
        return true;
      }
      visited.add(currentParentId);

      const [record] = await client
        .select({ id: categories.id, parentId: categories.parentId })
        .from(categories)
        .where(eq(categories.id, currentParentId))
        .limit(1);

      currentParentId = record?.parentId ?? null;
    }

    return false;
  }
}
