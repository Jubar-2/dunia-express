import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  PRODUCT_STATUS_VALUES,
  type ProductStatusValue,
} from './create-product.dto.js';

export const SORT_ORDER_VALUES = ['asc', 'desc'] as const;
export type SortOrderValue = (typeof SORT_ORDER_VALUES)[number];

export class QueryProductDto {
  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'sneakers', description: 'Search title/description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: PRODUCT_STATUS_VALUES })
  @IsOptional()
  @IsEnum(PRODUCT_STATUS_VALUES)
  status?: ProductStatusValue;

  @ApiPropertyOptional({ example: 'c66922b9-e4a8-4ce6-9922-a9b0c74f518a' })
  @IsOptional()
  @IsUUID('4')
  brandId?: string;

  @ApiPropertyOptional({ example: 'createdAt', description: 'Field to sort by' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: SORT_ORDER_VALUES, default: 'desc' })
  @IsOptional()
  @IsEnum(SORT_ORDER_VALUES)
  sortOrder?: SortOrderValue = 'desc';
}
