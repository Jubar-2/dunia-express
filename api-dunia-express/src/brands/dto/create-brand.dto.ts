import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    example: 'Apple',
    description: 'Brand display name',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'apple',
    description: 'Unique URL slug for the brand',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  slug: string;

  @ApiPropertyOptional({
    example: 'https://example.com/apple-logo.png',
    description: 'Optional URL to brand logo or image',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: 'Apple consumer electronics brand',
    description: 'Optional detailed description of the brand',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Indicates whether the brand is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
