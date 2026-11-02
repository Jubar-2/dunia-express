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
import { BrandsService } from './brands.service.js';
import {
  CreateBrandDto,
  UpdateBrandDto,
  QueryBrandDto,
} from './dto/index.js';

@ApiTags('Brands')
@Controller(['api/brands', 'brands'])
@UseFilters(CentralizedExceptionFilter)
@UseInterceptors(ResponseTransformInterceptor)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all brands with optional filtering and pagination',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brands retrieved successfully',
  })
  async findAll(@Query() query?: QueryBrandDto) {
    return this.brandsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get single brand by UUID or unique slug' })
  @ApiParam({ name: 'id', description: 'Brand UUID or slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Brand not found',
  })
  async findOne(@Param('id') idOrSlug: string) {
    return this.brandsService.findByIdOrSlug(idOrSlug);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('access-token')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Manage, subject: 'ecommerce' })
  @ApiOperation({
    summary: 'Create a new brand (Requires ecommerce_user or admin role)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Brand created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed or invalid payload',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Brand name or slug already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden: User role does not have required permissions',
  })
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Manage, subject: 'ecommerce' })
  @ApiOperation({
    summary: 'Update brand by UUID (Requires ecommerce_user or admin role)',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Brand UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed or invalid payload',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Brand not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Brand name or slug uniqueness conflict',
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
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities({ action: Action.Manage, subject: 'ecommerce' })
  @ApiOperation({
    summary: 'Delete brand by UUID (Requires ecommerce_user or admin role)',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Brand UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Brand not found',
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
    return this.brandsService.delete(id);
  }
}
