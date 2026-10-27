import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuditService } from './audit.service.js';
import { AuditRepository } from './audit.repository.js';

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: AuditRepository,
          useValue: {
            create: vi.fn().mockResolvedValue({ id: 'audit-1' }),
            findByUserId: vi.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
