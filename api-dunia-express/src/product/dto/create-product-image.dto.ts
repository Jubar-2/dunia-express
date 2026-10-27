import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    description: 'Image URL',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({
    example: 'Red running shoe side profile',
    description: 'Alternative text for accessibility',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Designates this image as main thumbnail',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isThumbnail?: boolean = false;

  @ApiPropertyOptional({
    example: 0,
    description: 'Display order / position',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  position?: number = 0;

  @ApiPropertyOptional({
    example: 'd9b2d63d-a233-40e8-b80c-0d32bb398322',
    description: 'Optional associated variant UUID',
  })
  @IsOptional()
  @IsUUID()
  variantId?: string;
}
