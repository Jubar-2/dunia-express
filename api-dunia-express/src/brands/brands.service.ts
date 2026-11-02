import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BrandsRepository } from './brands.repository.js';
import type { Brand, NewBrand } from '../database/schema/index.js';
import {
  CreateBrandDto,
  UpdateBrandDto,
  QueryBrandDto,
} from './dto/index.js';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class BrandsService {
  constructor(private readonly brandsRepository: BrandsRepository) {}

  async findAll(query?: QueryBrandDto) {
    return this.brandsRepository.findAll(query);
  }

  async findById(id: string): Promise<Brand> {
    const brand = await this.brandsRepository.findById(id);
    if (!brand) {
      throw new NotFoundException(`Brand with ID '${id}' not found`);
    }
    return brand;
  }

  async findByIdOrSlug(idOrSlug: string): Promise<Brand> {
    let brand: Brand | null = null;

    if (UUID_REGEX.test(idOrSlug)) {
      brand = await this.brandsRepository.findById(idOrSlug);
    }

    if (!brand) {
      brand = await this.brandsRepository.findBySlug(idOrSlug);
    }

    if (!brand) {
      throw new NotFoundException(`Brand '${idOrSlug}' not found`);
    }

    return brand;
  }

  async create(dto: CreateBrandDto): Promise<Brand> {
    const normalizedName = dto.name.trim();
    const normalizedSlug = dto.slug.trim().toLowerCase();

    const existingName = await this.brandsRepository.findByName(normalizedName);
    if (existingName) {
      throw new ConflictException(
        `Brand with name '${normalizedName}' already exists`,
      );
    }

    const existingSlug = await this.brandsRepository.findBySlug(normalizedSlug);
    if (existingSlug) {
      throw new ConflictException(
        `Brand with slug '${normalizedSlug}' already exists`,
      );
    }

    const brandData: NewBrand = {
      name: normalizedName,
      slug: normalizedSlug,
      image: dto.image ?? null,
      description: dto.description ?? null,
      isActive: dto.isActive ?? true,
    };

    return this.brandsRepository.create(brandData);
  }

  async update(id: string, dto: UpdateBrandDto): Promise<Brand> {
    const existing = await this.brandsRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Brand with ID '${id}' not found`);
    }

    if (dto.slug !== undefined) {
      const normalizedSlug = dto.slug.trim().toLowerCase();
      if (normalizedSlug !== existing.slug) {
        const slugExists = await this.brandsRepository.findBySlug(normalizedSlug);
        if (slugExists && slugExists.id !== id) {
          throw new ConflictException(
            `Brand with slug '${normalizedSlug}' already exists`,
          );
        }
      }
    }

    if (dto.name !== undefined) {
      const normalizedName = dto.name.trim();
      if (normalizedName !== existing.name) {
        const nameExists = await this.brandsRepository.findByName(normalizedName);
        if (nameExists && nameExists.id !== id) {
          throw new ConflictException(
            `Brand with name '${normalizedName}' already exists`,
          );
        }
      }
    }

    const updateData: Partial<NewBrand> = {};
    if (dto.name !== undefined) updateData.name = dto.name.trim();
    if (dto.slug !== undefined) updateData.slug = dto.slug.trim().toLowerCase();
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    updateData.updatedAt = new Date();

    const updated = await this.brandsRepository.update(id, updateData);
    if (!updated) {
      throw new NotFoundException(`Brand with ID '${id}' not found`);
    }

    return updated;
  }

  async delete(id: string): Promise<{ id: string; message: string }> {
    const existing = await this.brandsRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Brand with ID '${id}' not found`);
    }

    await this.brandsRepository.delete(id);
    return {
      id,
      message: 'Brand deleted successfully',
    };
  }
}
