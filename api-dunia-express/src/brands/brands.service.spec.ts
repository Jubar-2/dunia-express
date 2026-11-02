import { ConflictException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BrandsService } from './brands.service.js';
import { BrandsRepository } from './brands.repository.js';
import type { Brand } from '../database/schema/index.js';

describe('BrandsService', () => {
  let service: BrandsService;
  let repository: BrandsRepository;

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
    repository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findByName: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as BrandsRepository;

    service = new BrandsService(repository);
  });

  describe('findAll', () => {
    it('should return paginated brands', async () => {
      const mockResult = {
        items: [mockBrand],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      vi.mocked(repository.findAll).mockResolvedValue(mockResult);

      const result = await service.findAll();
      expect(result).toEqual(mockResult);
      expect(repository.findAll).toHaveBeenCalledWith(undefined);
    });
  });

  describe('findById', () => {
    it('should return brand by UUID', async () => {
      vi.mocked(repository.findById).mockResolvedValue(mockBrand);

      const result = await service.findById(mockBrand.id);
      expect(result).toEqual(mockBrand);
      expect(repository.findById).toHaveBeenCalledWith(mockBrand.id);
    });

    it('should throw NotFoundException if brand not found', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByIdOrSlug', () => {
    it('should find by UUID when UUID provided', async () => {
      vi.mocked(repository.findById).mockResolvedValue(mockBrand);

      const result = await service.findByIdOrSlug(mockBrand.id);
      expect(result).toEqual(mockBrand);
      expect(repository.findById).toHaveBeenCalledWith(mockBrand.id);
    });

    it('should find by slug when slug provided', async () => {
      vi.mocked(repository.findBySlug).mockResolvedValue(mockBrand);

      const result = await service.findByIdOrSlug('apple');
      expect(result).toEqual(mockBrand);
      expect(repository.findBySlug).toHaveBeenCalledWith('apple');
    });

    it('should throw NotFoundException when neither matches', async () => {
      vi.mocked(repository.findBySlug).mockResolvedValue(null);

      await expect(service.findByIdOrSlug('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create brand successfully', async () => {
      vi.mocked(repository.findByName).mockResolvedValue(null);
      vi.mocked(repository.findBySlug).mockResolvedValue(null);
      vi.mocked(repository.create).mockResolvedValue(mockBrand);

      const result = await service.create({
        name: 'Apple',
        slug: 'apple',
        image: 'https://example.com/apple-logo.png',
        description: 'Apple consumer electronics brand',
        isActive: true,
      });

      expect(result).toEqual(mockBrand);
      expect(repository.create).toHaveBeenCalledWith({
        name: 'Apple',
        slug: 'apple',
        image: 'https://example.com/apple-logo.png',
        description: 'Apple consumer electronics brand',
        isActive: true,
      });
    });

    it('should throw ConflictException if brand name already exists', async () => {
      vi.mocked(repository.findByName).mockResolvedValue(mockBrand);

      await expect(
        service.create({
          name: 'Apple',
          slug: 'unique-slug',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if brand slug already exists', async () => {
      vi.mocked(repository.findByName).mockResolvedValue(null);
      vi.mocked(repository.findBySlug).mockResolvedValue(mockBrand);

      await expect(
        service.create({
          name: 'Unique Apple',
          slug: 'apple',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update brand successfully', async () => {
      const updatedBrand: Brand = {
        ...mockBrand,
        name: 'Apple Inc.',
        slug: 'apple-inc',
      };

      vi.mocked(repository.findById).mockResolvedValue(mockBrand);
      vi.mocked(repository.findBySlug).mockResolvedValue(null);
      vi.mocked(repository.findByName).mockResolvedValue(null);
      vi.mocked(repository.update).mockResolvedValue(updatedBrand);

      const result = await service.update(mockBrand.id, {
        name: 'Apple Inc.',
        slug: 'apple-inc',
      });

      expect(result).toEqual(updatedBrand);
      expect(repository.update).toHaveBeenCalledWith(
        mockBrand.id,
        expect.objectContaining({
          name: 'Apple Inc.',
          slug: 'apple-inc',
        }),
      );
    });

    it('should throw NotFoundException if brand to update does not exist', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if updated slug conflicts with another brand', async () => {
      const otherBrand: Brand = {
        ...mockBrand,
        id: 'b2222222-2222-4222-8222-222222222222',
        slug: 'other-slug',
      };

      vi.mocked(repository.findById).mockResolvedValue(mockBrand);
      vi.mocked(repository.findBySlug).mockResolvedValue(otherBrand);

      await expect(
        service.update(mockBrand.id, { slug: 'other-slug' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if updated name conflicts with another brand', async () => {
      const otherBrand: Brand = {
        ...mockBrand,
        id: 'b2222222-2222-4222-8222-222222222222',
        name: 'Samsung',
      };

      vi.mocked(repository.findById).mockResolvedValue(mockBrand);
      vi.mocked(repository.findByName).mockResolvedValue(otherBrand);

      await expect(
        service.update(mockBrand.id, { name: 'Samsung' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete brand successfully', async () => {
      vi.mocked(repository.findById).mockResolvedValue(mockBrand);
      vi.mocked(repository.delete).mockResolvedValue(true);

      const result = await service.delete(mockBrand.id);
      expect(result).toEqual({
        id: mockBrand.id,
        message: 'Brand deleted successfully',
      });
      expect(repository.delete).toHaveBeenCalledWith(mockBrand.id);
    });

    it('should throw NotFoundException if brand does not exist', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
