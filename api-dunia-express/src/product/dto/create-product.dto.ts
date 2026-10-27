import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateProductVariantDto } from './create-product-variant.dto.js';
import { CreateProductImageDto } from './create-product-image.dto.js';

export const PRODUCT_STATUS_VALUES = ['ACTIVE', 'DRAFT', 'ARCHIVED'] as const;
export type ProductStatusValue = (typeof PRODUCT_STATUS_VALUES)[number];

export class CreateProductDto {
  @ApiProperty({
    example: 'Nike Air Max 90',
    description: 'Product display title',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'nike-air-max-90',
    description: 'Unique URL slug (auto-generated from title if omitted)',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional({
    example: 'Iconic running shoes engineered with maximum cushioning.',
    description: 'Detailed description in plain text or markdown',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 129.99,
    description: 'Standard product regular price',
    minimum: 0.01,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  regularPrice: number;

  @ApiPropertyOptional({
    example: 99.99,
    description: 'Discounted promotional offer price',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  offerPrice?: number;

  @ApiPropertyOptional({
    enum: PRODUCT_STATUS_VALUES,
    default: 'DRAFT',
    description: 'Publication status',
  })
  @IsOptional()
  @IsEnum(PRODUCT_STATUS_VALUES, {
    message: `Status must be one of: ${PRODUCT_STATUS_VALUES.join(', ')}`,
  })
  status?: ProductStatusValue = 'DRAFT';

  @ApiPropertyOptional({
    example: 'c66922b9-e4a8-4ce6-9922-a9b0c74f518a',
    description: 'UUID of associated Brand',
  })
  @IsOptional()
  @IsUUID('4', { message: 'brandId must be a valid UUID' })
  brandId?: string;

  @ApiPropertyOptional({
    type: [CreateProductVariantDto],
    description: 'List of product SKU variants',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];

  @ApiPropertyOptional({
    type: [CreateProductImageDto],
    description: 'List of product gallery images',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];
}
