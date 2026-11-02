import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CategoriesRepository,
  type CategoryTreeItem,
} from './categories.repository.js';
import type { Category, NewCategory } from '../database/schema/index.js';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  QueryCategoryDto,
} from './dto/index.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoriesRepository) {}

  async findAll(query?: QueryCategoryDto): Promise<Category[]> {
    return this.categoryRepository.findAll(query);
  }

  async findTree(): Promise<CategoryTreeItem[]> {
    const allCategories = await this.categoryRepository.findAll();

    const categoryMap = new Map<string, CategoryTreeItem>();
    for (const cat of allCategories) {
      categoryMap.set(cat.id, {
        ...cat,
        children: [],
      });
    }

    const roots: CategoryTreeItem[] = [];

    for (const cat of allCategories) {
      const item = categoryMap.get(cat.id)!;
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        const parent = categoryMap.get(cat.parentId)!;
        parent.children.push(item);
      } else {
        roots.push(item);
      }
    }

    return roots;
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }
    return category;
  }

  async findChildren(id: string): Promise<Category[]> {
    const parent = await this.categoryRepository.findById(id);
    if (!parent) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }
    return this.categoryRepository.findChildren(id);
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    if (dto.parentId) {
      const parent = await this.categoryRepository.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID '${dto.parentId}' not found`,
        );
      }
    }

    const categoryData: NewCategory = {
      image: dto.image ?? null,
      color: dto.color ?? null,
      parentId: dto.parentId ?? null,
    };

    return this.categoryRepository.create(categoryData);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new BadRequestException('A category cannot be its own parent');
      }

      if (dto.parentId !== null) {
        const targetParent = await this.categoryRepository.findById(
          dto.parentId,
        );
        if (!targetParent) {
          throw new NotFoundException(
            `Parent category with ID '${dto.parentId}' not found`,
          );
        }

        const isDescendant = await this.categoryRepository.isDescendantOf(
          dto.parentId,
          id,
        );
        if (isDescendant) {
          throw new BadRequestException(
            'Cannot move category under one of its descendants (circular reference detected)',
          );
        }
      }
    }

    const updateData: Partial<NewCategory> = {};
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.color !== undefined) updateData.color = dto.color;
    if (dto.parentId !== undefined) updateData.parentId = dto.parentId;

    const updated = await this.categoryRepository.update(id, updateData);
    if (!updated) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    return updated;
  }

  async delete(id: string): Promise<{ id: string; message: string }> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    await this.categoryRepository.delete(id);
    return {
      id,
      message: 'Category deleted successfully',
    };
  }
}
