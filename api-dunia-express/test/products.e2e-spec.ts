import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { CentralizedExceptionFilter } from '../src/common/filters/http-exception.filter.js';

describe('Products API (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let configService: ConfigService;

  let adminToken: string;
  let ecommerceToken: string;
  let standardUserToken: string;

  let createdProductId: string;
  let createdProductSlug: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Replicate main.ts pipes and filters
    app.useGlobalFilters(new CentralizedExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    const secret = configService.get<string>('JWT_ACCESS_SECRET');

    // Admin user in Neon DB: jubaer@example.com (id: 91f9d835-4caa-4d1d-bfb0-630a4af08530)
    adminToken = jwtService.sign(
      {
        sub: '91f9d835-4caa-4d1d-bfb0-630a4af08530',
        email: 'jubaer@example.com',
        token_type: 'access',
        jti: 'test-admin-jti',
      },
      { secret, expiresIn: '15m' },
    );

    // E-commerce user in Neon DB: ecom@example.com (id: cf62694d-aade-4d12-940a-e2c08e856d0f)
    ecommerceToken = jwtService.sign(
      {
        sub: 'cf62694d-aade-4d12-940a-e2c08e856d0f',
        email: 'ecom@example.com',
        token_type: 'access',
        jti: 'test-ecom-jti',
      },
      { secret, expiresIn: '15m' },
    );

    // Standard user in Neon DB: jubaer@exa.com (id: ba4009a3-36ed-4f69-bbdc-6aa54ded3cad, role: user)
    standardUserToken = jwtService.sign(
      {
        sub: 'ba4009a3-36ed-4f69-bbdc-6aa54ded3cad',
        email: 'jubaer@exa.com',
        token_type: 'access',
        jti: 'test-user-jti',
      },
      { secret, expiresIn: '15m' },
    );
  });

  afterAll(async () => {
    if (createdProductId) {
      // Clean up test product
      await request(app.getHttpServer())
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }
    await app.close();
  });

  describe('1. Public Read Endpoints', () => {
    it('GET /api/products should return 200 OK without token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data.items)).toBe(true);
      expect(res.body.data.meta).toHaveProperty('total');
    });

    it('GET /products (alias) should return 200 OK without token', async () => {
      const res = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
    });

    it('GET /api/products/:id with non-existent ID should return 404 with standardized error', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/products/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body).toEqual({
        success: false,
        error: expect.stringContaining('not found'),
      });
    });
  });

  describe('2. Protected Endpoints - Missing / Invalid Authentication (401)', () => {
    it('POST /api/products without token should return 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/products')
        .send({ title: 'Unauthorized Test', regularPrice: 50 })
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('PUT /api/products/:id without token should return 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/products/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Unauthorized Update' })
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('DELETE /api/products/:id without token should return 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/products/00000000-0000-0000-0000-000000000000')
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('3. Protected Endpoints - Role-Based Authorization (403)', () => {
    it('POST /api/products with invalid role (standard user) should return 403 Forbidden', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${standardUserToken}`)
        .send({
          title: 'Forbidden Test Product',
          regularPrice: 49.99,
        })
        .expect(403);

      expect(res.body).toEqual({
        success: false,
        error: 'You are not authorized to perform this action',
      });
    });

    it('PUT /api/products/:id with invalid role should return 403 Forbidden', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${standardUserToken}`)
        .send({ title: 'Hacked Title' })
        .expect(403);

      expect(res.body).toEqual({
        success: false,
        error: 'You are not authorized to perform this action',
      });
    });

    it('DELETE /api/products/:id with invalid role should return 403 Forbidden', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${standardUserToken}`)
        .expect(403);

      expect(res.body).toEqual({
        success: false,
        error: 'You are not authorized to perform this action',
      });
    });
  });

  describe('4. Input Validation (400 Bad Request)', () => {
    it('POST /api/products should reject extra unexpected fields (forbidNonWhitelisted)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Extra Fields Test',
          regularPrice: 99.99,
          maliciousField: 'exploit',
        })
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toMatch(/property maliciousField should not exist/i);
    });

    it('POST /api/products should reject negative or zero regularPrice', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Negative Price Shoe',
          regularPrice: -10,
        })
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toMatch(/regularPrice/i);
    });

    it('POST /api/products should reject offerPrice > regularPrice', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Invalid Offer Price',
          regularPrice: 50.0,
          offerPrice: 75.0,
        })
        .expect(400);

      expect(res.body).toEqual({
        success: false,
        error: 'Offer price cannot be greater than regular price',
      });
    });
  });

  describe('5. Successful CRUD with Authorized Roles (admin & ecommerce_user)', () => {
    it('POST /api/products with ecommerce_user token should create product and return 201', async () => {
      const testSku = `ECOM-VAR-${Date.now()}`;
      const payload = {
        title: `E2E Test Running Shoes ${Date.now()}`,
        description: 'High performance running sneakers',
        regularPrice: 159.99,
        offerPrice: 129.99,
        status: 'ACTIVE',
        variants: [
          {
            sku: testSku,
            price: 129.99,
            compareAtPrice: 159.99,
            quantity: 50,
          },
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            altText: 'Side view of running sneaker',
            isThumbnail: true,
            position: 1,
          },
        ],
      };

      const res = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${ecommerceToken}`)
        .send(payload)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.status).toBe('ACTIVE');
      expect(res.body.data.variants).toHaveLength(1);
      expect(res.body.data.variants[0].sku).toBe(testSku);
      expect(res.body.data.images).toHaveLength(1);

      createdProductId = res.body.data.id;
      createdProductSlug = res.body.data.slug;
    });

    it('GET /api/products/:id should retrieve the created product by UUID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/products/${createdProductId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdProductId);
      expect(res.body.data.variants).toHaveLength(1);
    });

    it('GET /api/products/:id should retrieve the created product by Slug', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/products/${createdProductSlug}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdProductId);
      expect(res.body.data.slug).toBe(createdProductSlug);
    });

    it('PUT /api/products/:id with admin token should update product and return 200', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Pro Running Shoes',
          regularPrice: 189.99,
          offerPrice: 149.99,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Pro Running Shoes');
      expect(Number(res.body.data.regularPrice)).toBe(189.99);
      expect(Number(res.body.data.offerPrice)).toBe(149.99);
    });

    it('DELETE /api/products/:id with admin token should delete product and return 200', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toBe('Product deleted successfully');

      // Verify product is now 404
      const getRes = await request(app.getHttpServer())
        .get(`/api/products/${createdProductId}`)
        .expect(404);

      expect(getRes.body).toEqual({
        success: false,
        error: `Product '${createdProductId}' not found`,
      });

      // Clear id so afterAll doesn't try to delete again
      createdProductId = '';
    });
  });
});
