import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { AbilitiesGuard } from '../casl/abilities/abilities.guard.js';
import { CheckAbilities } from '../casl/decorators/check-abilities.decorator.js';
import { Action } from '../casl/ability.factory.js';
import { CentralizedExceptionFilter } from '../common/filters/http-exception.filter.js';
import { ResponseTransformInterceptor } from '../common/interceptors/response-transform.interceptor.js';
import { ProductService } from './product.service.js';
import {
  CreateProductDto,
  UpdateProductDto,
  QueryProductDto,
} from './dto/index.js';

@ApiTags('Products')
@Controller(['api/products', 'products'])
@UseFilters(CentralizedExceptionFilter)
@UseInterceptors(ResponseTransformInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all products with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
  })
  async findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get single product by UUID or slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async findOne(@Param('id') idOrSlug: string) {
    return this.productService.findByIdOrSlug(idOrSlug);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('access-token')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Manage, subject: 'ecommerce' })
  @ApiOperation({
    summary: 'Create a new product (Requires ecommerce_user or admin role)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed or invalid payload',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden: User role does not have required permissions',
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Manage, subject: 'ecommerce' })
  @ApiOperation({
    summary: 'Update existing product by UUID (Requires ecommerce_user or admin role)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed or invalid payload',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden: User role does not have required permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Manage, subject: 'ecommerce' })
  @ApiOperation({
    summary: 'Delete product by UUID (Requires ecommerce_user or admin role)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden: User role does not have required permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
