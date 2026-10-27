import { Module } from '@nestjs/common';
import { AuditService } from './audit.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { AuditRepository } from './audit.repository.js';

@Module({
  imports: [DatabaseModule],
  providers: [AuditService, AuditRepository],
  exports: [AuditService, AuditRepository],
})
export class AuditModule {}
