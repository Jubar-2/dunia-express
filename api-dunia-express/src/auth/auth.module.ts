import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuditModule } from '../audit/audit.module.js';
import { AccessTokenGuard } from '../common/guards/access-token.guard.js';
import { PasswordService } from '../common/security/password/password.service.js';
import { UsersRepository } from '../users/users.repository.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { SessionsRepository } from './sessions.repository.js';
import { SessionsService } from './sessions.service.js';
import { AccessTokenStrategy } from './strategies/access-token.strategy/access-token.strategy.js';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy/refresh-token.strategy.js';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    AuditModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    UsersRepository,
    SessionsRepository,
    SessionsService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AuthService, SessionsService],
})
export class AuthModule {}
