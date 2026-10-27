import { Inject, Injectable } from '@nestjs/common';
import { and, desc, asc, eq, ilike, or, sql, count } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../database/database.constants.js';
import {
  brand,
  products,
  productVariants,
  productImages,
  type Product,
  type NewProduct,
  type ProductVariant,
  type ProductImage,
} from '../database/schema/index.js';
import { QueryProductDto } from './dto/query-product.dto.js';
import { CreateProductVariantDto } from './dto/create-product-variant.dto.js';
import { CreateProductImageDto } from './dto/create-product-image.dto.js';

export interface ProductDetail extends Product {
  brand?: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
  variants: ProductVariant[];
  images: ProductImage[];
}

@Injectable()
export class ProductRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAll(query: QueryProductDto, tx?: DrizzleDB): Promise<{
    items: ProductDetail[];
    total: number;
    page: number;
    limit: number;
  }> {
    const client = tx ?? this.db;
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const offset = (page - 1) * limit;

    const conditions: any[] = [];

    if (query.status) {
      conditions.push(eq(products.status, query.status));
    }

    if (query.brandId) {
      conditions.push(eq(products.brandId, query.brandId));
    }

    if (query.search && query.search.trim()) {
      const term = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(products.title, term),
          ilike(products.description, term),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Count query
    const [countResult] = await client
      .select({ total: count() })
      .from(products)
      .where(whereClause);

    const total = Number(countResult?.total || 0);

    // Sorting
    const sortOrder = query.sortOrder?.toLowerCase() === 'asc' ? asc : desc;
    let orderColumn = products.createdAt;
    if (query.sortBy === 'title') {
      orderColumn = products.title as any;
    } else if (query.sortBy === 'regularPrice') {
      orderColumn = products.regularPrice as any;
    }

    const productRows = await client
      .select({
        product: products,
        brand: {
          id: brand.id,
          name: brand.name,
          logo: brand.logo,
        },
      })
      .from(products)
      .leftJoin(brand, eq(products.brandId, brand.id))
      .where(whereClause)
      .orderBy(sortOrder(orderColumn))
      .limit(limit)
      .offset(offset);

    if (productRows.length === 0) {
      return { items: [], total, page, limit };
    }

    const productIds = productRows.map((r) => r.product.id);

    // Batch fetch variants and images
    const allVariants = await client
      .select()
      .from(productVariants)
      .where(sql`${productVariants.productId} IN ${productIds}`);

    const allImages = await client
      .select()
      .from(productImages)
      .where(sql`${productImages.productId} IN ${productIds}`)
      .orderBy(asc(productImages.position));

    const variantsByProductId = new Map<string, ProductVariant[]>();
    for (const v of allVariants) {
      const list = variantsByProductId.get(v.productId) || [];
      list.push(v);
      variantsByProductId.set(v.productId, list);
    }

    const imagesByProductId = new Map<string, ProductImage[]>();
    for (const img of allImages) {
      const list = imagesByProductId.get(img.productId) || [];
      list.push(img);
      imagesByProductId.set(img.productId, list);
    }

    const items: ProductDetail[] = productRows.map((row) => ({
      ...row.product,
      brand: row.brand?.id ? row.brand : null,
      variants: variantsByProductId.get(row.product.id) || [],
      images: imagesByProductId.get(row.product.id) || [],
    }));

    return { items, total, page, limit };
  }

  async findById(id: string, tx?: DrizzleDB): Promise<ProductDetail | null> {
    const client = tx ?? this.db;

    const rows = await client
      .select({
        product: products,
        brand: {
          id: brand.id,
          name: brand.name,
          logo: brand.logo,
        },
      })
      .from(products)
      .leftJoin(brand, eq(products.brandId, brand.id))
      .where(eq(products.id, id))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];

    const variants = await client
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, id));

    const images = await client
      .select()
      .from(productImages)
      .where(eq(productImages.productId, id))
      .orderBy(asc(productImages.position));

    return {
      ...row.product,
      brand: row.brand?.id ? row.brand : null,
      variants,
      images,
    };
  }

  async findBySlug(slug: string, tx?: DrizzleDB): Promise<ProductDetail | null> {
    const client = tx ?? this.db;

    const rows = await client
      .select({
        product: products,
        brand: {
          id: brand.id,
          name: brand.name,
          logo: brand.logo,
        },
      })
      .from(products)
      .leftJoin(brand, eq(products.brandId, brand.id))
      .where(eq(products.slug, slug))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];

    const variants = await client
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, row.product.id));

    const images = await client
      .select()
      .from(productImages)
      .where(eq(productImages.productId, row.product.id))
      .orderBy(asc(productImages.position));

    return {
      ...row.product,
      brand: row.brand?.id ? row.brand : null,
      variants,
      images,
    };
  }

  async create(
    productData: NewProduct,
    variantsData?: CreateProductVariantDto[],
    imagesData?: CreateProductImageDto[],
  ): Promise<ProductDetail> {
    return this.db.transaction(async (tx) => {
      const [createdProduct] = await tx
        .insert(products)
        .values(productData)
        .returning();

      let createdVariants: ProductVariant[] = [];
      const variantSkuToId = new Map<string, string>();

      if (variantsData && variantsData.length > 0) {
        const variantInserts = variantsData.map((v) => ({
          productId: createdProduct.id,
          sku: v.sku,
          price: String(v.price),
          compareAtPrice: v.compareAtPrice !== undefined ? String(v.compareAtPrice) : null,
          quantity: v.quantity ?? 0,
        }));

        createdVariants = await tx
          .insert(productVariants)
          .values(variantInserts)
          .returning();

        for (const cv of createdVariants) {
          variantSkuToId.set(cv.sku, cv.id);
        }
      }

      let createdImages: ProductImage[] = [];
      if (imagesData && imagesData.length > 0) {
        const imageInserts = imagesData.map((img) => ({
          productId: createdProduct.id,
          variantId: img.variantId || null,
          url: img.url,
          altText: img.altText || null,
          isThumbnail: img.isThumbnail ?? false,
          position: img.position ?? 0,
        }));

        createdImages = await tx
          .insert(productImages)
          .values(imageInserts)
          .returning();
      }

      let brandData = null;
      if (createdProduct.brandId) {
        const [b] = await tx
          .select({ id: brand.id, name: brand.name, logo: brand.logo })
          .from(brand)
          .where(eq(brand.id, createdProduct.brandId))
          .limit(1);
        brandData = b || null;
      }

      return {
        ...createdProduct,
        brand: brandData,
        variants: createdVariants,
        images: createdImages,
      };
    });
  }

  async update(
    id: string,
    productData: Partial<NewProduct>,
    variantsData?: CreateProductVariantDto[],
    imagesData?: CreateProductImageDto[],
  ): Promise<ProductDetail | null> {
    return this.db.transaction(async (tx) => {
      const [updatedProduct] = await tx
        .update(products)
        .set(productData)
        .where(eq(products.id, id))
        .returning();

      if (!updatedProduct) {
        return null;
      }

      if (variantsData !== undefined) {
        await tx.delete(productVariants).where(eq(productVariants.productId, id));
        if (variantsData.length > 0) {
          const variantInserts = variantsData.map((v) => ({
            productId: id,
            sku: v.sku,
            price: String(v.price),
            compareAtPrice:
              v.compareAtPrice !== undefined ? String(v.compareAtPrice) : null,
            quantity: v.quantity ?? 0,
          }));
          await tx.insert(productVariants).values(variantInserts);
        }
      }

      if (imagesData !== undefined) {
        await tx.delete(productImages).where(eq(productImages.productId, id));
        if (imagesData.length > 0) {
          const imageInserts = imagesData.map((img) => ({
            productId: id,
            variantId: img.variantId || null,
            url: img.url,
            altText: img.altText || null,
            isThumbnail: img.isThumbnail ?? false,
            position: img.position ?? 0,
          }));
          await tx.insert(productImages).values(imageInserts);
        }
      }

      return this.findById(id, tx as any);
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });
    return result.length > 0;
  }
}
