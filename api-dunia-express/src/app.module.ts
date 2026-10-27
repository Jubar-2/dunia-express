import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ServiceController } from './service/service.controller.js';
import { AuditModule } from './audit/audit.module.js';
import { CaslModule } from './casl/casl.module.js';
import { validateEnv } from './common/config/env.validation.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProductModule } from './product/product.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', 'api-dunia-express/.env'],
      isGlobal: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: Number(config.get<number>('THROTTLE_TTL')) || 60000,
          limit: Number(config.get<number>('THROTTLE_LIMIT')) || 10,
        },
      ],
    }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    AuditModule,
    CaslModule,
    ProductModule,
  ],
  controllers: [AppController, ServiceController],
  providers: [AppService],
})
export class AppModule {}
