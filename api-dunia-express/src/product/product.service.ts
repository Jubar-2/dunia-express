import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository, type ProductDetail } from './product.repository.js';
import {
  CreateProductDto,
  UpdateProductDto,
  QueryProductDto,
} from './dto/index.js';
import type { NewProduct } from '../database/schema/index.js';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAll(query: QueryProductDto) {
    const result = await this.productRepository.findAll(query);
    const totalPages = Math.ceil(result.total / result.limit) || 1;
    return {
      items: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages,
      },
    };
  }

  async findById(id: string): Promise<ProductDetail> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return product;
  }

  async findByIdOrSlug(idOrSlug: string): Promise<ProductDetail> {
    let product: ProductDetail | null = null;

    if (UUID_REGEX.test(idOrSlug)) {
      product = await this.productRepository.findById(idOrSlug);
    }

    if (!product) {
      product = await this.productRepository.findBySlug(idOrSlug);
    }

    if (!product) {
      throw new NotFoundException(`Product '${idOrSlug}' not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto): Promise<ProductDetail> {
    let slug = dto.slug?.trim().toLowerCase();

    if (!slug) {
      const baseSlug = slugify(dto.title);
      slug = baseSlug;
      let counter = 1;
      while (await this.productRepository.findBySlug(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    } else {
      const existing = await this.productRepository.findBySlug(slug);
      if (existing) {
        throw new ConflictException(`Product with slug '${slug}' already exists`);
      }
    }

    if (dto.offerPrice !== undefined && dto.offerPrice > dto.regularPrice) {
      throw new BadRequestException(
        'Offer price cannot be greater than regular price',
      );
    }

    if (dto.variants && dto.variants.length > 0) {
      const skus = dto.variants.map((v) => v.sku.trim().toUpperCase());
      const uniqueSkus = new Set(skus);
      if (uniqueSkus.size !== skus.length) {
        throw new BadRequestException(
          'Duplicate SKUs provided in product variants',
        );
      }
    }

    const productData: NewProduct = {
      title: dto.title.trim(),
      slug,
      description: dto.description || null,
      regularPrice: String(dto.regularPrice),
      offerPrice: dto.offerPrice !== undefined ? String(dto.offerPrice) : null,
      status: dto.status || 'DRAFT',
      brandId: dto.brandId || null,
    };

    return this.productRepository.create(
      productData,
      dto.variants,
      dto.images,
    );
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDetail> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    let slug = dto.slug?.trim().toLowerCase();
    if (slug && slug !== existing.slug) {
      const slugExists = await this.productRepository.findBySlug(slug);
      if (slugExists && slugExists.id !== id) {
        throw new ConflictException(`Product with slug '${slug}' already exists`);
      }
    }

    const regularPrice =
      dto.regularPrice !== undefined
        ? dto.regularPrice
        : Number(existing.regularPrice);

    const offerPrice =
      dto.offerPrice !== undefined
        ? dto.offerPrice
        : existing.offerPrice !== null
          ? Number(existing.offerPrice)
          : undefined;

    if (
      offerPrice !== undefined &&
      regularPrice !== undefined &&
      offerPrice > regularPrice
    ) {
      throw new BadRequestException(
        'Offer price cannot be greater than regular price',
      );
    }

    if (dto.variants && dto.variants.length > 0) {
      const skus = dto.variants.map((v) => v.sku.trim().toUpperCase());
      const uniqueSkus = new Set(skus);
      if (uniqueSkus.size !== skus.length) {
        throw new BadRequestException(
          'Duplicate SKUs provided in product variants',
        );
      }
    }

    const updateData: Partial<NewProduct> = {};
    if (dto.title !== undefined) updateData.title = dto.title.trim();
    if (slug !== undefined) updateData.slug = slug;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.regularPrice !== undefined)
      updateData.regularPrice = String(dto.regularPrice);
    if (dto.offerPrice !== undefined)
      updateData.offerPrice = String(dto.offerPrice);
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.brandId !== undefined) updateData.brandId = dto.brandId || null;

    const updated = await this.productRepository.update(
      id,
      updateData,
      dto.variants,
      dto.images,
    );

    if (!updated) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    return updated;
  }

  async delete(id: string): Promise<{ id: string; message: string }> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    await this.productRepository.delete(id);
    return {
      id,
      message: 'Product deleted successfully',
    };
  }
}
