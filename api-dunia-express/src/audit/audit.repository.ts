import { Inject } from '@nestjs/common';
import { DRIZZLE, type DrizzleDB } from '../database/database.constants.js';
import {
  NewAuditLog,
  auditLogs,
} from '../database/schema/audit-logs.schema.js';
import { desc, eq } from 'drizzle-orm';

export class AuditRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(data: NewAuditLog, tx?: DrizzleDB) {
    const client = tx ?? this.db;
    const log = await client.insert(auditLogs).values(data).returning();
    return log;
  }

  async findByUserId(userId: string, limit = 50) {
    return this.db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }
}
