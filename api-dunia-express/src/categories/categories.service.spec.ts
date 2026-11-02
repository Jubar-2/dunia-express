import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoriesService } from './categories.service.js';
import { CategoriesRepository } from './categories.repository.js';
import type { Category } from '../database/schema/index.js';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: CategoriesRepository;

  const rootCategory: Category = {
    id: '11111111-1111-4111-8111-111111111111',
    image: 'https://example.com/electronics.png',
    color: '#3B82F6',
    parentId: null,
  };

  const subCategory: Category = {
    id: '22222222-2222-4222-8222-222222222222',
    image: 'https://example.com/mobile.png',
    color: '#8B5CF6',
    parentId: rootCategory.id,
  };

  const subSubCategory: Category = {
    id: '33333333-3333-4333-8333-333333333333',
    image: 'https://example.com/smartphones.png',
    color: '#10B981',
    parentId: subCategory.id,
  };

  beforeEach(() => {
    repository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findChildren: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      isDescendantOf: vi.fn(),
    } as unknown as CategoriesRepository;

    service = new CategoriesService(repository);
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      vi.mocked(repository.findAll).mockResolvedValue([rootCategory, subCategory]);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(repository.findAll).toHaveBeenCalledWith(undefined);
    });
  });

  describe('findTree', () => {
    it('should build dynamic nested hierarchy without N+1 queries', async () => {
      vi.mocked(repository.findAll).mockResolvedValue([
        rootCategory,
        subCategory,
        subSubCategory,
      ]);

      const tree = await service.findTree();

      expect(tree).toHaveLength(1);
      expect(tree[0].id).toBe(rootCategory.id);
      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children[0].id).toBe(subCategory.id);
      expect(tree[0].children[0].children).toHaveLength(1);
      expect(tree[0].children[0].children[0].id).toBe(subSubCategory.id);
      expect(tree[0].children[0].children[0].children).toEqual([]);

      // Avoided N+1: only a single findAll call was made
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return category when found', async () => {
      vi.mocked(repository.findById).mockResolvedValue(rootCategory);

      const result = await service.findById(rootCategory.id);
      expect(result).toEqual(rootCategory);
    });

    it('should throw NotFoundException when category does not exist', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findChildren', () => {
    it('should return direct children if parent exists', async () => {
      vi.mocked(repository.findById).mockResolvedValue(rootCategory);
      vi.mocked(repository.findChildren).mockResolvedValue([subCategory]);

      const result = await service.findChildren(rootCategory.id);
      expect(result).toEqual([subCategory]);
      expect(repository.findChildren).toHaveBeenCalledWith(rootCategory.id);
    });

    it('should throw NotFoundException if parent category does not exist', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(service.findChildren('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create root category when parentId is null or omitted', async () => {
      vi.mocked(repository.create).mockResolvedValue(rootCategory);

      const result = await service.create({
        image: 'https://example.com/electronics.png',
        color: '#3B82F6',
        parentId: null,
      });

      expect(result).toEqual(rootCategory);
      expect(repository.create).toHaveBeenCalledWith({
        image: 'https://example.com/electronics.png',
        color: '#3B82F6',
        parentId: null,
      });
    });

    it('should create subcategory under existing parent category', async () => {
      vi.mocked(repository.findById).mockResolvedValue(rootCategory);
      vi.mocked(repository.create).mockResolvedValue(subCategory);

      const result = await service.create({
        image: 'https://example.com/mobile.png',
        color: '#8B5CF6',
        parentId: rootCategory.id,
      });

      expect(result).toEqual(subCategory);
      expect(repository.findById).toHaveBeenCalledWith(rootCategory.id);
      expect(repository.create).toHaveBeenCalledWith({
        image: 'https://example.com/mobile.png',
        color: '#8B5CF6',
        parentId: rootCategory.id,
      });
    });

    it('should throw NotFoundException when parentId does not exist', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(
        service.create({
          image: 'https://example.com/mobile.png',
          parentId: 'non-existent-id',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update category fields successfully', async () => {
      vi.mocked(repository.findById).mockResolvedValue(rootCategory);
      const updatedCat = { ...rootCategory, color: '#000000' };
      vi.mocked(repository.update).mockResolvedValue(updatedCat);

      const result = await service.update(rootCategory.id, { color: '#000000' });
      expect(result.color).toBe('#000000');
    });

    it('should throw BadRequestException when category is set as its own parent', async () => {
      vi.mocked(repository.findById).mockResolvedValue(rootCategory);

      await expect(
        service.update(rootCategory.id, { parentId: rootCategory.id }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if new parent category does not exist', async () => {
      vi.mocked(repository.findById)
        .mockResolvedValueOnce(subCategory) // existing category found
        .mockResolvedValueOnce(null); // target parent not found

      await expect(
        service.update(subCategory.id, { parentId: 'non-existent-id' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when moving category under its own descendant (circular reference)', async () => {
      vi.mocked(repository.findById)
        .mockResolvedValueOnce(rootCategory) // existing root
        .mockResolvedValueOnce(subSubCategory); // target parent
      vi.mocked(repository.isDescendantOf).mockResolvedValue(true); // subSubCategory is descendant of rootCategory

      await expect(
        service.update(rootCategory.id, { parentId: subSubCategory.id }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow moving category to root (parentId: null)', async () => {
      vi.mocked(repository.findById).mockResolvedValue(subCategory);
      const movedToRoot = { ...subCategory, parentId: null };
      vi.mocked(repository.update).mockResolvedValue(movedToRoot);

      const result = await service.update(subCategory.id, { parentId: null });
      expect(result.parentId).toBeNull();
      expect(repository.update).toHaveBeenCalledWith(subCategory.id, {
        parentId: null,
      });
    });
  });

  describe('delete', () => {
    it('should delete existing category', async () => {
      vi.mocked(repository.findById).mockResolvedValue(rootCategory);
      vi.mocked(repository.delete).mockResolvedValue(true);

      const result = await service.delete(rootCategory.id);
      expect(result).toEqual({
        id: rootCategory.id,
        message: 'Category deleted successfully',
      });
    });

    it('should throw NotFoundException when deleting non-existent category', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(service.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
