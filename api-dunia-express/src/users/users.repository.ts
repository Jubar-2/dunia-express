import { User, NewUser, users } from '../database/schema/index.js';
import { DRIZZLE, type DrizzleDB } from '../database/database.constants.js';
import { isNull, and, sql } from 'drizzle-orm';
import { Inject } from '@nestjs/common';

export class UsersRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findByEmail(email: string, tx?: DrizzleDB): Promise<User | null> {
    const client = tx ?? this.db;
    const normalized = email.trim().toLowerCase();
    const user = await client
      .select()
      .from(users)
      .where(and(sql`lower(email) = ${normalized}`, isNull(users.deletedAt)))
      .limit(1);
    return user[0] || null;
  }

  async findById(id: string, tx?: DrizzleDB): Promise<User | null> {
    const client = tx ?? this.db;
    const user = await client
      .select()
      .from(users)
      .where(and(sql`users.id = ${id}`, isNull(users.deletedAt)))
      .limit(1);
    return user[0] || null;
  }

  async create(data: NewUser, tx?: DrizzleDB): Promise<User> {
    const client = tx ?? this.db;
    const [user] = await client.insert(users).values(data).returning();
    return user;
  }
}
