import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateBrandDto {
  @ApiPropertyOptional({
    example: 'Apple Inc.',
    description: 'Updated brand display name',
    minLength: 2,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    example: 'apple-inc',
    description: 'Updated unique URL slug for the brand',
    minLength: 2,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  slug?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/apple-logo.png',
    description: 'Updated URL to brand logo or image',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: 'Updated brand description',
    description: 'Updated detailed description of the brand',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Updated brand active status',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
