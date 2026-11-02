import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import type { Category } from '../database/schema/index.js';
import type { CategoryTreeItem } from './categories.repository.js';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory: Category = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    image: 'https://example.com/electronics.png',
    color: '#3B82F6',
    parentId: null,
  };

  const mockTree: CategoryTreeItem[] = [
    {
      ...mockCategory,
      children: [
        {
          id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
          image: 'https://example.com/phones.png',
          color: '#8B5CF6',
          parentId: mockCategory.id,
          children: [],
        },
      ],
    },
  ];

  beforeEach(() => {
    service = {
      findAll: vi.fn(),
      findTree: vi.fn(),
      findById: vi.fn(),
      findChildren: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CategoriesService;

    controller = new CategoriesController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call categoriesService.findAll', async () => {
      vi.mocked(service.findAll).mockResolvedValue([mockCategory]);

      const result = await controller.findAll();
      expect(result).toEqual([mockCategory]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getTree', () => {
    it('should call categoriesService.findTree', async () => {
      vi.mocked(service.findTree).mockResolvedValue(mockTree);

      const result = await controller.getTree();
      expect(result).toEqual(mockTree);
      expect(service.findTree).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call categoriesService.findById', async () => {
      vi.mocked(service.findById).mockResolvedValue(mockCategory);

      const result = await controller.findOne(mockCategory.id);
      expect(result).toEqual(mockCategory);
      expect(service.findById).toHaveBeenCalledWith(mockCategory.id);
    });
  });

  describe('findChildren', () => {
    it('should call categoriesService.findChildren', async () => {
      vi.mocked(service.findChildren).mockResolvedValue([]);

      const result = await controller.findChildren(mockCategory.id);
      expect(result).toEqual([]);
      expect(service.findChildren).toHaveBeenCalledWith(mockCategory.id);
    });
  });

  describe('create', () => {
    it('should call categoriesService.create with dto', async () => {
      const dto = {
        image: 'https://example.com/electronics.png',
        color: '#3B82F6',
        parentId: null,
      };
      vi.mocked(service.create).mockResolvedValue(mockCategory);

      const result = await controller.create(dto);
      expect(result).toEqual(mockCategory);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call categoriesService.update with id and dto', async () => {
      const dto = { color: '#000000' };
      const updatedCategory = { ...mockCategory, color: '#000000' };
      vi.mocked(service.update).mockResolvedValue(updatedCategory);

      const result = await controller.update(mockCategory.id, dto);
      expect(result).toEqual(updatedCategory);
      expect(service.update).toHaveBeenCalledWith(mockCategory.id, dto);
    });
  });

  describe('delete', () => {
    it('should call categoriesService.delete with id', async () => {
      const deleteResponse = {
        id: mockCategory.id,
        message: 'Category deleted successfully',
      };
      vi.mocked(service.delete).mockResolvedValue(deleteResponse);

      const result = await controller.delete(mockCategory.id);
      expect(result).toEqual(deleteResponse);
      expect(service.delete).toHaveBeenCalledWith(mockCategory.id);
    });
  });
});
