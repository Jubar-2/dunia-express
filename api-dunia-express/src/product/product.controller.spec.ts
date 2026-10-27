import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductController } from './product.controller.js';
import { ProductService } from './product.service.js';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

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
    service = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByIdOrSlug: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as ProductService;

    controller = new ProductController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call productService.findAll with query', async () => {
      vi.mocked(service.findAll).mockResolvedValue({
        items: [mockProduct],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      const result = await controller.findAll({ page: 1, limit: 10 });
      expect(result.items).toHaveLength(1);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe('findOne', () => {
    it('should call productService.findByIdOrSlug', async () => {
      vi.mocked(service.findByIdOrSlug).mockResolvedValue(mockProduct);

      const result = await controller.findOne(mockProduct.id);
      expect(result).toEqual(mockProduct);
      expect(service.findByIdOrSlug).toHaveBeenCalledWith(mockProduct.id);
    });
  });

  describe('create', () => {
    it('should call productService.create with DTO', async () => {
      vi.mocked(service.create).mockResolvedValue(mockProduct);

      const dto = {
        title: 'New Shoe',
        regularPrice: 99.99,
      };

      const result = await controller.create(dto as any);
      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call productService.update with id and DTO', async () => {
      vi.mocked(service.update).mockResolvedValue(mockProduct);

      const dto = { title: 'Updated' };
      const result = await controller.update(mockProduct.id, dto);
      expect(result).toEqual(mockProduct);
      expect(service.update).toHaveBeenCalledWith(mockProduct.id, dto);
    });
  });

  describe('delete', () => {
    it('should call productService.delete with id', async () => {
      vi.mocked(service.delete).mockResolvedValue({
        id: mockProduct.id,
        message: 'Product deleted successfully',
      });

      const result = await controller.delete(mockProduct.id);
      expect(result.id).toBe(mockProduct.id);
      expect(service.delete).toHaveBeenCalledWith(mockProduct.id);
    });
  });
});
