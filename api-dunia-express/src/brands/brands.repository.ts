import { Inject, Injectable } from '@nestjs/common';
import { and, asc, count, eq, ilike, or, type SQL } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../database/database.constants.js';
import {
  brands,
  type Brand,
  type NewBrand,
} from '../database/schema/index.js';
import { QueryBrandDto } from './dto/query-brand.dto.js';

@Injectable()
export class BrandsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAll(
    query?: QueryBrandDto,
    tx?: DrizzleDB,
  ): Promise<{
    items: Brand[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const client = tx ?? this.db;
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query?.limit) || 10));
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (query?.isActive !== undefined) {
      conditions.push(eq(brands.isActive, query.isActive));
    }

    if (query?.search && query.search.trim()) {
      const term = `%${query.search.trim()}%`;
      conditions.push(
        or(ilike(brands.name, term), ilike(brands.description, term))!,
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await client
      .select({ total: count() })
      .from(brands)
      .where(whereClause);

    const total = Number(countResult?.total || 0);
    const totalPages = Math.ceil(total / limit) || 1;

    const items = await client
      .select()
      .from(brands)
      .where(whereClause)
      .orderBy(asc(brands.name))
      .limit(limit)
      .offset(offset);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findById(id: string, tx?: DrizzleDB): Promise<Brand | null> {
    const client = tx ?? this.db;
    const [found] = await client
      .select()
      .from(brands)
      .where(eq(brands.id, id))
      .limit(1);

    return found ?? null;
  }

  async findBySlug(slug: string, tx?: DrizzleDB): Promise<Brand | null> {
    const client = tx ?? this.db;
    const [found] = await client
      .select()
      .from(brands)
      .where(eq(brands.slug, slug.trim().toLowerCase()))
      .limit(1);

    return found ?? null;
  }

  async findByName(name: string, tx?: DrizzleDB): Promise<Brand | null> {
    const client = tx ?? this.db;
    const [found] = await client
      .select()
      .from(brands)
      .where(eq(brands.name, name.trim()))
      .limit(1);

    return found ?? null;
  }

  async create(data: NewBrand, tx?: DrizzleDB): Promise<Brand> {
    const client = tx ?? this.db;
    const [created] = await client
      .insert(brands)
      .values(data)
      .returning();

    return created;
  }

  async update(
    id: string,
    data: Partial<NewBrand>,
    tx?: DrizzleDB,
  ): Promise<Brand | null> {
    const client = tx ?? this.db;
    const [updated] = await client
      .update(brands)
      .set(data)
      .where(eq(brands.id, id))
      .returning();

    return updated ?? null;
  }

  async delete(id: string, tx?: DrizzleDB): Promise<boolean> {
    const client = tx ?? this.db;
    const result = await client
      .delete(brands)
      .where(eq(brands.id, id))
      .returning({ id: brands.id });

    return result.length > 0;
  }
}
