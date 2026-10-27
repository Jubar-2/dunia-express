import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

import { CaslAbilityFactory } from '../casl/ability.factory.js';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: vi.fn(),
            findById: vi.fn(),
          },
        },
        {
          provide: CaslAbilityFactory,
          useValue: {
            createForUser: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
