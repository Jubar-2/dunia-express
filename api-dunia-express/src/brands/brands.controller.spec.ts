import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BrandsController } from './brands.controller.js';
import { BrandsService } from './brands.service.js';
import type { Brand } from '../database/schema/index.js';

describe('BrandsController', () => {
  let controller: BrandsController;
  let service: BrandsService;

  const mockBrand: Brand = {
    id: 'a1111111-1111-4111-8111-111111111111',
    name: 'Apple',
    slug: 'apple',
    image: 'https://example.com/apple-logo.png',
    description: 'Apple consumer electronics brand',
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    service = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByIdOrSlug: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as BrandsService;

    controller = new BrandsController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call brandsService.findAll', async () => {
      const mockResult = {
        items: [mockBrand],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      vi.mocked(service.findAll).mockResolvedValue(mockResult);

      const result = await controller.findAll();
      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });
  });

  describe('findOne', () => {
    it('should call brandsService.findByIdOrSlug', async () => {
      vi.mocked(service.findByIdOrSlug).mockResolvedValue(mockBrand);

      const result = await controller.findOne(mockBrand.id);
      expect(result).toEqual(mockBrand);
      expect(service.findByIdOrSlug).toHaveBeenCalledWith(mockBrand.id);
    });
  });

  describe('create', () => {
    it('should call brandsService.create with valid dto', async () => {
      const dto = {
        name: 'Apple',
        slug: 'apple',
        image: 'https://example.com/apple-logo.png',
        description: 'Apple consumer electronics brand',
        isActive: true,
      };
      vi.mocked(service.create).mockResolvedValue(mockBrand);

      const result = await controller.create(dto);
      expect(result).toEqual(mockBrand);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call brandsService.update with valid id and dto', async () => {
      const dto = {
        name: 'Apple Inc.',
        slug: 'apple-inc',
      };
      const updatedBrand = { ...mockBrand, ...dto };
      vi.mocked(service.update).mockResolvedValue(updatedBrand);

      const result = await controller.update(mockBrand.id, dto);
      expect(result).toEqual(updatedBrand);
      expect(service.update).toHaveBeenCalledWith(mockBrand.id, dto);
    });
  });

  describe('delete', () => {
    it('should call brandsService.delete with id', async () => {
      const deleteResult = {
        id: mockBrand.id,
        message: 'Brand deleted successfully',
      };
      vi.mocked(service.delete).mockResolvedValue(deleteResult);

      const result = await controller.delete(mockBrand.id);
      expect(result).toEqual(deleteResult);
      expect(service.delete).toHaveBeenCalledWith(mockBrand.id);
    });
  });
});
