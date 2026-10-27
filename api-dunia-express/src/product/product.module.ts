import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CaslModule } from '../casl/casl.module.js';
import { ProductController } from './product.controller.js';
import { ProductService } from './product.service.js';
import { ProductRepository } from './product.repository.js';

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
