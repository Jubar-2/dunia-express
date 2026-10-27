import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { UsersRepository } from './users.repository.js';
import { PasswordService } from '../common/security/password/password.service.js';
import { DatabaseModule } from '../database/database.module.js';

import { CaslModule } from '../casl/casl.module.js';

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [UsersController],
  providers: [UsersService, PasswordService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
