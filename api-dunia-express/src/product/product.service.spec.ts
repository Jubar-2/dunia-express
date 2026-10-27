import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductService } from './product.service.js';
import { ProductRepository } from './product.repository.js';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;

  const mockProduct = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    title: 'Test Product',
    slug: 'test-product',
    description: 'A test product description',
    regularPrice: '100.00',
    offerPrice: '80.00',
    status: 'ACTIVE' as const,
    brandId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: null,
    variants: [],
    images: [],
  };

  beforeEach(() => {
    repository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as ProductRepository;

    service = new ProductService(repository);
  });

  describe('findAll', () => {
    it('should return paginated products list', async () => {
      vi.mocked(repository.findAll).mockResolvedValue({
        items: [mockProduct],
        total: 1,
        page: 1,
        limit: 10,
      });

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('findByIdOrSlug', () => {
    it('should find product by UUID', async () => {
      vi.mocked(repository.findById).mockResolvedValue(mockProduct);

      const result = await service.findByIdOrSlug(mockProduct.id);
      expect(result).toEqual(mockProduct);
      expect(repository.findById).toHaveBeenCalledWith(mockProduct.id);
    });

    it('should find product by slug if not a UUID', async () => {
      vi.mocked(repository.findBySlug).mockResolvedValue(mockProduct);

      const result = await service.findByIdOrSlug('test-product');
      expect(result).toEqual(mockProduct);
      expect(repository.findBySlug).toHaveBeenCalledWith('test-product');
    });

    it('should throw NotFoundException if product is not found', async () => {
      vi.mocked(repository.findBySlug).mockResolvedValue(null);

      await expect(service.findByIdOrSlug('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should auto-generate slug from title and create product', async () => {
      vi.mocked(repository.findBySlug).mockResolvedValue(null);
      vi.mocked(repository.create).mockResolvedValue(mockProduct);

      const result = await service.create({
        title: 'New Shoe',
        regularPrice: 99.99,
        offerPrice: 79.99,
      });

      expect(result).toEqual(mockProduct);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Shoe',
          slug: 'new-shoe',
          regularPrice: '99.99',
          offerPrice: '79.99',
        }),
        undefined,
        undefined,
      );
    });

    it('should throw BadRequestException if offerPrice > regularPrice', async () => {
      await expect(
        service.create({
          title: 'Invalid Price',
          regularPrice: 50.0,
          offerPrice: 60.0,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if variants have duplicate SKUs', async () => {
      await expect(
        service.create({
          title: 'Shoe',
          regularPrice: 50.0,
          variants: [
            { sku: 'SAME-SKU', price: 50 },
            { sku: 'same-sku', price: 50 },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update product successfully', async () => {
      vi.mocked(repository.findById).mockResolvedValue(mockProduct);
      vi.mocked(repository.update).mockResolvedValue({
        ...mockProduct,
        title: 'Updated Shoe',
      });

      const result = await service.update(mockProduct.id, {
        title: 'Updated Shoe',
      });

      expect(result.title).toBe('Updated Shoe');
    });

    it('should throw NotFoundException if updating non-existent product', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(
        service.update('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', {
          title: 'Updated',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete product when found', async () => {
      vi.mocked(repository.findById).mockResolvedValue(mockProduct);
      vi.mocked(repository.delete).mockResolvedValue(true);

      const result = await service.delete(mockProduct.id);
      expect(result).toEqual({
        id: mockProduct.id,
        message: 'Product deleted successfully',
      });
    });

    it('should throw NotFoundException when deleting non-existent product', async () => {
      vi.mocked(repository.findById).mockResolvedValue(null);

      await expect(
        service.delete('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
