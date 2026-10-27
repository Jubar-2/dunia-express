import { Injectable, Logger } from '@nestjs/common';
import { AuditActionType } from './audit.constants.js';
import { DrizzleDB } from '../database/database.constants.js';
import { AuditRepository } from './audit.repository.js';

export interface CreateAuditLogParams {
  userId?: string | null;
  action: AuditActionType;
  resource: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly auditRepository: AuditRepository) {}

  async log(params: CreateAuditLogParams, tx?: DrizzleDB): Promise<void> {
    try {
      await this.auditRepository.create(
        {
          userId: params.userId ?? null,
          action: params.action,
          resource: params.resource,
          resourceId: params.resourceId ?? null,
          metadata: params.metadata ?? null,
          ipAddress: params.ipAddress ?? null,
          userAgent: params.userAgent ?? null,
        },
        tx,
      );
    } catch (error: any) {
      const cause = error?.cause?.message ?? error?.cause;
      this.logger.error(
        `Failed to record audit log for action "${params.action}" on resource "${params.resource}"${cause ? `: ${cause}` : ''}`,
        error instanceof Error ? error.stack : error,
      );

      if (tx) {
        throw error;
      }
    }
  }
}
