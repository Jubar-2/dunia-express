import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  @MinLength(16, {
    message:
      'JWT_ACCESS_SECRET must be at least 16 characters long for security',
  })
  JWT_ACCESS_SECRET: string;

  @IsString()
  @MinLength(16, {
    message:
      'JWT_REFRESH_SECRET must be at least 16 characters long for security',
  })
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_ACCESS_EXPIRES_IN: string = '15m';

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN: string = '7d';

  @IsString()
  @IsOptional()
  JWT_ISSUER?: string;

  @IsString()
  @IsOptional()
  JWT_AUDIENCE?: string;

  @IsNumber()
  @IsOptional()
  SALT_ROUNDS: number = 10;

  @IsNumber()
  @IsOptional()
  THROTTLE_TTL: number = 60000;

  @IsNumber()
  @IsOptional()
  THROTTLE_LIMIT: number = 10;

  @IsString()
  @IsOptional()
  FRONTEND_ORIGIN?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const formattedErrors = errors
      .map((e) => Object.values(e.constraints || {}).join(', '))
      .join('; ');
    throw new Error(`Environment validation failed: ${formattedErrors}`);
  }

  if (
    validatedConfig.JWT_ACCESS_SECRET === validatedConfig.JWT_REFRESH_SECRET
  ) {
    throw new Error(
      'Security error: JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be distinct secrets.',
    );
  }

  return validatedConfig;
}
