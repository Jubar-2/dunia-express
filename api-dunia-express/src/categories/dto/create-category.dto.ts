import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CreateCategoryDto {
  @ApiPropertyOptional({
    example: 'https://example.com/electronics.png',
    description: 'Category image URL or resource path',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  image?: string | null;

  @ApiPropertyOptional({
    example: '#3B82F6',
    description: 'Category hex color or theme code',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  color?: string | null;

  @ApiPropertyOptional({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Parent category UUID (omit or null for root category)',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUUID('all', { message: 'parentId must be a valid UUID' })
  parentId?: string | null;
}
