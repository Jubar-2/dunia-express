import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CaslAbilityFactory } from './ability.factory.js';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
