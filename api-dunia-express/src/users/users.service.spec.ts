import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersService } from './users.service.js';
import { UsersRepository } from './users.repository.js';
import { PasswordService } from '../common/security/password/password.service.js';
import { DRIZZLE } from '../database/database.constants.js';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: vi.fn(),
            findById: vi.fn(),
            create: vi.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: vi.fn().mockResolvedValue('hashed_pwd'),
            comparePassword: vi.fn().mockResolvedValue(true),
          },
        },
        {
          provide: DRIZZLE,
          useValue: {
            transaction: vi.fn((cb) =>
              cb({
                insert: vi
                  .fn()
                  .mockReturnValue({
                    values: vi
                      .fn()
                      .mockReturnValue({
                        returning: vi
                          .fn()
                          .mockResolvedValue([{ id: 'user-1' }]),
                      }),
                  }),
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
