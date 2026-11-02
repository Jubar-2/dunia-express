import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { CentralizedExceptionFilter } from '../src/common/filters/http-exception.filter.js';

describe('Categories API (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let configService: ConfigService;

  let adminToken: string;
  let ecommerceToken: string;
  let standardUserToken: string;

  let createdRootCatId: string;
  let createdSubCatId: string;
  let createdSubSubCatId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Match main.ts pipes and filters
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

    // Admin user token
    adminToken = jwtService.sign(
      {
        sub: '91f9d835-4caa-4d1d-bfb0-630a4af08530',
        email: 'jubaer@example.com',
        token_type: 'access',
        jti: 'test-admin-cat-jti',
      },
      { secret, expiresIn: '15m' },
    );

    // E-commerce user token
    ecommerceToken = jwtService.sign(
      {
        sub: 'cf62694d-aade-4d12-940a-e2c08e856d0f',
        email: 'ecom@example.com',
        token_type: 'access',
        jti: 'test-ecom-cat-jti',
      },
      { secret, expiresIn: '15m' },
    );

    // Standard user token
    standardUserToken = jwtService.sign(
      {
        sub: 'ba4009a3-36ed-4f69-bbdc-6aa54ded3cad',
        email: 'jubaer@exa.com',
        token_type: 'access',
        jti: 'test-user-cat-jti',
      },
      { secret, expiresIn: '15m' },
    );
  });

  afterAll(async () => {
    // Clean up created categories in reverse order (bottom-up)
    const tokenHeader = `Bearer ${adminToken}`;
    if (createdSubSubCatId) {
      await request(app.getHttpServer())
        .delete(`/api/categories/${createdSubSubCatId}`)
        .set('Authorization', tokenHeader);
    }
    if (createdSubCatId) {
      await request(app.getHttpServer())
        .delete(`/api/categories/${createdSubCatId}`)
        .set('Authorization', tokenHeader);
    }
    if (createdRootCatId) {
      await request(app.getHttpServer())
        .delete(`/api/categories/${createdRootCatId}`)
        .set('Authorization', tokenHeader);
    }
    await app.close();
  });

  describe('1. Public Read Endpoints', () => {
    it('GET /api/categories should return 200 OK without token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/categories')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /categories (alias) should return 200 OK without token', async () => {
      const res = await request(app.getHttpServer())
        .get('/categories')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/categories/tree should return 200 OK without token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/categories/tree')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/categories/:id with non-existent UUID should return 404', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/categories/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body).toEqual({
        success: false,
        error: expect.stringContaining('not found'),
      });
    });

    it('GET /api/categories/:id/children with non-existent UUID should return 404', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/categories/00000000-0000-0000-0000-000000000000/children')
        .expect(404);

      expect(res.body).toEqual({
        success: false,
        error: expect.stringContaining('not found'),
      });
    });
  });

  describe('2. Protected Endpoints - Missing / Invalid Authentication (401)', () => {
    it('POST /api/categories without token should return 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/categories')
        .send({ color: '#3B82F6' })
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('PATCH /api/categories/:id without token should return 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/categories/00000000-0000-0000-0000-000000000000')
        .send({ color: '#10B981' })
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('DELETE /api/categories/:id without token should return 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/categories/00000000-0000-0000-0000-000000000000')
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('3. Protected Endpoints - Role-Based Authorization (403)', () => {
    it('POST /api/categories with standard user token should return 403 Forbidden', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${standardUserToken}`)
        .send({ color: '#3B82F6' })
        .expect(403);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('PATCH /api/categories/:id with standard user token should return 403 Forbidden', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/categories/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${standardUserToken}`)
        .send({ color: '#10B981' })
        .expect(403);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });

    it('DELETE /api/categories/:id with standard user token should return 403 Forbidden', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/categories/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${standardUserToken}`)
        .expect(403);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('4. Input Validation (400 Bad Request)', () => {
    it('POST /api/categories should reject extra unexpected fields (forbidNonWhitelisted)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${ecommerceToken}`)
        .send({ color: '#3B82F6', unexpectedHackField: 'malicious' })
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toContain('property unexpectedHackField should not exist');
    });

    it('POST /api/categories should reject invalid parentId format (not UUID)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${ecommerceToken}`)
        .send({ parentId: 'not-a-valid-uuid' })
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toContain('parentId must be a valid UUID');
    });

    it('GET /api/categories/invalid-uuid should reject invalid UUID in route param', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/categories/invalid-uuid')
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('5. Full Category & Subcategory Lifecycle & Tree Hierarchy', () => {
    it('POST /api/categories should create a root category (parentId: null)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${ecommerceToken}`)
        .send({
          image: 'https://example.com/electronics.png',
          color: '#3B82F6',
          parentId: null,
        })
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.image).toBe('https://example.com/electronics.png');
      expect(res.body.data.color).toBe('#3B82F6');
      expect(res.body.data.parentId).toBeNull();

      createdRootCatId = res.body.data.id;
    });

    it('POST /api/categories should create a subcategory referencing parentId', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${ecommerceToken}`)
        .send({
          image: 'https://example.com/mobile.png',
          color: '#8B5CF6',
          parentId: createdRootCatId,
        })
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.parentId).toBe(createdRootCatId);
      expect(res.body.data.color).toBe('#8B5CF6');

      createdSubCatId = res.body.data.id;
    });

    it('POST /api/categories should create a sub-subcategory under subcategory', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${ecommerceToken}`)
        .send({
          image: 'https://example.com/smartphones.png',
          color: '#10B981',
          parentId: createdSubCatId,
        })
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.parentId).toBe(createdSubCatId);

      createdSubSubCatId = res.body.data.id;
    });

    it('POST /api/categories should fail with 404 if parentId does not exist', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${ecommerceToken}`)
        .send({
          image: 'https://example.com/orphan.png',
          parentId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toContain('Parent category with ID');
    });

    it('GET /api/categories/:id should retrieve the category by UUID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/categories/${createdRootCatId}`)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.id).toBe(createdRootCatId);
    });

    it('GET /api/categories/:id/children should retrieve direct children only', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/categories/${createdRootCatId}/children`)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
      const childIds = res.body.data.map((c: any) => c.id);
      expect(childIds).toContain(createdSubCatId);
      expect(childIds).not.toContain(createdSubSubCatId);
    });

    it('GET /api/categories/tree should return the full multi-level nested hierarchy', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/categories/tree')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);

      const rootInTree = res.body.data.find((c: any) => c.id === createdRootCatId);
      expect(rootInTree).toBeDefined();
      expect(rootInTree.children).toBeDefined();

      const subInTree = rootInTree.children.find((c: any) => c.id === createdSubCatId);
      expect(subInTree).toBeDefined();
      expect(subInTree.children).toBeDefined();

      const subSubInTree = subInTree.children.find((c: any) => c.id === createdSubSubCatId);
      expect(subSubInTree).toBeDefined();
    });

    it('PATCH /api/categories/:id should reject self-referencing parentId (400 Bad Request)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/categories/${createdRootCatId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ parentId: createdRootCatId })
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toContain('A category cannot be its own parent');
    });

    it('PATCH /api/categories/:id should reject circular reference (moving category under its own descendant)', async () => {
      // Trying to set root's parent to its descendant sub-subcategory
      const res = await request(app.getHttpServer())
        .patch(`/api/categories/${createdRootCatId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ parentId: createdSubSubCatId })
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toContain('circular reference detected');
    });

    it('PATCH /api/categories/:id should successfully update image and color', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/categories/${createdRootCatId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          image: 'https://example.com/electronics-updated.png',
          color: '#1E40AF',
        })
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.image).toBe('https://example.com/electronics-updated.png');
      expect(res.body.data.color).toBe('#1E40AF');
    });

    it('PATCH /api/categories/:id should support moving subcategory to root (parentId: null)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/categories/${createdSubCatId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ parentId: null })
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.parentId).toBeNull();

      // Move it back under root for clean hierarchy testing
      await request(app.getHttpServer())
        .patch(`/api/categories/${createdSubCatId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ parentId: createdRootCatId })
        .expect(200);
    });

    it('DELETE /api/categories/:id should delete category and return 200', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/categories/${createdSubSubCatId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toEqual({
        id: createdSubSubCatId,
        message: 'Category deleted successfully',
      });
      createdSubSubCatId = ''; // Marked cleaned
    });
  });
});
