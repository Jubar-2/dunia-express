import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CaslModule } from '../casl/casl.module.js';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { CategoriesRepository } from './categories.repository.js';

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
