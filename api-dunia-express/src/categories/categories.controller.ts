import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { AbilitiesGuard } from '../casl/abilities/abilities.guard.js';
import { CheckAbilities } from '../casl/decorators/check-abilities.decorator.js';
import { Action } from '../casl/ability.factory.js';
import { CentralizedExceptionFilter } from '../common/filters/http-exception.filter.js';
import { ResponseTransformInterceptor } from '../common/interceptors/response-transform.interceptor.js';
import { CategoriesService } from './categories.service.js';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  QueryCategoryDto,
} from './dto/index.js';

@ApiTags('Categories')
@Controller(['api/categories', 'categories'])
@UseFilters(CentralizedExceptionFilter)
@UseInterceptors(ResponseTransformInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories retrieved successfully',
  })
  async findAll(@Query() query?: QueryCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  @Public()
  @Get('tree')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get nested categories hierarchy tree' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category tree retrieved successfully',
  })
  async getTree() {
    return this.categoriesService.findTree();
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get single category by UUID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.findById(id);
  }

  @Public()
  @Get(':id/children')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get direct children of a category' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Parent category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Direct children retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Parent category not found',
  })
  async findChildren(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.categoriesService.findChildren(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('access-token')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Manage, subject: 'ecommerce' })
  @ApiOperation({
    summary:
      'Create category or subcategory (Requires ecommerce_user or admin role)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed or invalid payload',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Referenced parent category not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden: User role does not have required permissions',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Manage, subject: 'ecommerce' })
  @ApiOperation({
    summary: 'Update category by UUID (Requires ecommerce_user or admin role)',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Self-parenting or circular reference detected',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category or target parent category not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden: User role does not have required permissions',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Manage, subject: 'ecommerce' })
  @ApiOperation({
    summary: 'Delete category by UUID (Requires ecommerce_user or admin role)',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Category UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden: User role does not have required permissions',
  })
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.delete(id);
  }
}
