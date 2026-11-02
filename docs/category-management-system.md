# Category, Brand, and Product Management System Documentation

## 1. Database Entity Relationship Diagram (ERD)

The ecommerce data model organizes catalog items through **Brands**, **Products**, and a self-referential hierarchical **Category** tree joined via the **SetCategory** junction table.

```mermaid
erDiagram
    BRANDS ||--o{ PRODUCTS : "has / categorizes (1:N)"
    PRODUCTS ||--o{ SET_CATEGORY : "classified via (1:N)"
    CATEGORIES ||--o{ SET_CATEGORY : "categorizes (1:N)"
    CATEGORIES ||--o{ CATEGORIES : "parent-child tree (1:N)"

    BRANDS {
        uuid id PK "gen_random_uuid()"
        varchar name UK "Unique brand display name"
        varchar slug UK "Unique SEO slug"
        text image "Brand logo/image URL"
        text description "Brand summary text"
        boolean is_active "Active flag (default true)"
        timestamp created_at "Creation timestamp with TZ"
        timestamp updated_at "Update timestamp with TZ"
    }

    PRODUCTS {
        uuid id PK "gen_random_uuid()"
        varchar title "Product display title"
        varchar slug UK "Unique URL slug"
        text description "Detailed description"
        numeric regular_price "Standard retail price"
        numeric offer_price "Promotional discount price"
        product_status status "ACTIVE | DRAFT | ARCHIVED"
        uuid brand_id FK "References brands.id (ON DELETE SET NULL)"
        timestamp created_at "Creation timestamp with TZ"
        timestamp updated_at "Update timestamp with TZ"
    }

    CATEGORIES {
        uuid id PK "gen_random_uuid()"
        text image "Category banner/thumbnail URL"
        text color "Category theme color hex"
        uuid parent_id FK "Self-reference to categories.id (ON DELETE SET NULL)"
    }

    SET_CATEGORY {
        uuid id PK "gen_random_uuid()"
        uuid product_id FK "References products.id (ON DELETE CASCADE)"
        uuid category_id FK "References categories.id (ON DELETE CASCADE)"
    }
```

---

## 2. System Architecture

```mermaid
flowchart TD
    subgraph Client Layer
        WebAdmin["Admin Frontend / API Consumers"]
    end

    subgraph Authentication & Authorization
        JWTGuard["AccessTokenGuard (JWT)"]
        AbilitiesGuard["AbilitiesGuard (CASL)"]
    end

    subgraph Brand Management
        BrandCtrl["BrandsController (/brands)"]
        BrandSvc["BrandsService"]
        BrandRepo["BrandsRepository"]
        BrandTable[("PostgreSQL: brands")]
    end

    subgraph Product Management
        ProdCtrl["ProductController (/products)"]
        ProdSvc["ProductService"]
        ProdRepo["ProductRepository"]
        ProdTable[("PostgreSQL: products")]
    end

    subgraph Category Management
        CatCtrl["CategoriesController (/categories)"]
        CatSvc["CategoriesService"]
        CatRepo["CategoriesRepository"]
        CatTable[("PostgreSQL: categories")]
        SetCatTable[("PostgreSQL: set_category")]
    end

    WebAdmin --> JWTGuard
    JWTGuard --> AbilitiesGuard
    AbilitiesGuard --> BrandCtrl
    AbilitiesGuard --> ProdCtrl
    AbilitiesGuard --> CatCtrl

    BrandCtrl --> BrandSvc --> BrandRepo --> BrandTable
    ProdCtrl --> ProdSvc --> ProdRepo --> ProdTable
    CatCtrl --> CatSvc --> CatRepo --> CatTable

    ProdSvc -.->|"Validate brandId existence"| ProdRepo
    ProdRepo -.->|"Query Brand Info"| BrandTable
    ProdRepo -.->|"Manage Category Links"| SetCatTable
```

---

## 3. Brand Create Workflow (`POST /brands`)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin User
    participant Controller as BrandsController
    participant Guard as AbilitiesGuard (CASL)
    participant Service as BrandsService
    participant Repo as BrandsRepository
    participant DB as PostgreSQL (brands)

    Admin->>Controller: POST /brands { name, slug, image, description, isActive }
    Controller->>Guard: Check permissions (Action.Manage, 'ecommerce')
    alt Permission Denied
        Guard-->>Admin: 403 Forbidden
    end

    Controller->>Service: create(CreateBrandDto)
    Service->>Repo: findByName(name)
    Repo->>DB: SELECT WHERE name = :name
    alt Name already exists
        Service-->>Admin: 409 ConflictException ("Brand with name '...' already exists")
    end

    Service->>Repo: findBySlug(slug)
    Repo->>DB: SELECT WHERE slug = :slug
    alt Slug already exists
        Service-->>Admin: 409 ConflictException ("Brand with slug '...' already exists")
    end

    Service->>Repo: create(brandData)
    Repo->>DB: INSERT INTO brands (...) VALUES (...) RETURNING *
    DB-->>Repo: Inserted Brand record
    Repo-->>Service: Brand
    Service-->>Controller: Brand
    Controller-->>Admin: 201 Created (Wrapped JSON response)
```

---

## 4. Brand Update Workflow (`PATCH /brands/:id`)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin User
    participant Controller as BrandsController
    participant Service as BrandsService
    participant Repo as BrandsRepository
    participant DB as PostgreSQL (brands)

    Admin->>Controller: PATCH /brands/:id { name?, slug?, image?, description?, isActive? }
    Controller->>Service: update(id, UpdateBrandDto)
    Service->>Repo: findById(id)
    Repo->>DB: SELECT WHERE id = :id
    alt Brand not found
        Service-->>Admin: 404 NotFoundException ("Brand with ID '...' not found")
    end

    opt Slug provided & changed
        Service->>Repo: findBySlug(newSlug)
        alt Slug belongs to another brand
            Service-->>Admin: 409 ConflictException ("Brand with slug '...' already exists")
        end
    end

    opt Name provided & changed
        Service->>Repo: findByName(newName)
        alt Name belongs to another brand
            Service-->>Admin: 409 ConflictException ("Brand with name '...' already exists")
        end
    end

    Note over Service: Construct Partial<NewBrand> excluding undefined fields
    Service->>Repo: update(id, updateData)
    Repo->>DB: UPDATE brands SET ... WHERE id = :id RETURNING *
    DB-->>Repo: Updated Brand record
    Repo-->>Service: Brand
    Service-->>Controller: Brand
    Controller-->>Admin: 200 OK (Updated brand)
```

---

## 5. Product Creation with Brand Selection & Category Assignment

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin User
    participant ProdController as ProductController
    participant ProdService as ProductService
    participant ProdRepo as ProductRepository
    participant DB as PostgreSQL

    Admin->>ProdController: POST /products { title, regularPrice, brandId?, categoryId?, variants?, images? }
    ProdController->>ProdService: create(CreateProductDto)

    opt brandId is provided
        ProdService->>ProdRepo: findBrandById(brandId)
        ProdRepo->>DB: SELECT FROM brands WHERE id = :brandId
        alt Brand not found
            ProdService-->>Admin: 404 NotFoundException ("Brand with ID '...' not found")
        end
    end

    opt categoryId is provided
        ProdService->>ProdRepo: findCategoryById(categoryId)
        ProdRepo->>DB: SELECT FROM categories WHERE id = :categoryId
        alt Category not found
            ProdService-->>Admin: 404 NotFoundException ("Category with ID '...' not found")
        end
    end

    ProdService->>ProdRepo: create(productData, variants, images, categoryId)
    Note over ProdRepo,DB: Transaction: Insert Product -> Insert Variants -> Insert Images -> Insert SetCategory
    ProdRepo->>DB: BEGIN TRANSACTION
    ProdRepo->>DB: INSERT INTO products (..., brand_id) VALUES (...)
    ProdRepo->>DB: INSERT INTO set_category (product_id, category_id) VALUES (...)
    ProdRepo->>DB: COMMIT TRANSACTION
    ProdRepo-->>ProdService: ProductDetail (including Brand & Category)
    ProdService-->>ProdController: ProductDetail
    ProdController-->>Admin: 201 Created
```

---

## 6. Product-Category Assignment Workflow

```mermaid
sequenceDiagram
    autonumber
    actor System as System / Product Workflow
    participant Repo as ProductRepository
    participant SetCategory as set_category table
    participant Products as products table
    participant Categories as categories table

    System->>Repo: Assign Category to Product (productId, categoryId)
    Repo->>Products: Verify product exists
    Repo->>Categories: Verify category exists
    Repo->>SetCategory: INSERT INTO set_category (product_id, category_id) ON CONFLICT DO NOTHING
    SetCategory-->>Repo: Link confirmed
    Repo-->>System: Assignment complete
```

---

## 7. Brand Module API Reference

### 7.1. Create Brand

- **Method**: `POST`
- **Path**: `/brands` (also `/api/brands`)
- **Access**: Bearer Token required (`manage:ecommerce` ability)
- **Request Body**:
```json
{
  "name": "Apple",
  "slug": "apple",
  "image": "https://example.com/apple-logo.png",
  "description": "Apple consumer electronics brand",
  "isActive": true
}
```
- **Responses**:
  - `201 Created`: Returns created brand object.
  - `400 Bad Request`: Validation failure (e.g. missing name or slug).
  - `401 Unauthorized`: Missing or invalid JWT.
  - `403 Forbidden`: Insufficient role/permissions.
  - `409 Conflict`: Duplicate brand name or slug.

### 7.2. Update Brand

- **Method**: `PATCH`
- **Path**: `/brands/:id` (also `/api/brands/:id`)
- **Access**: Bearer Token required (`manage:ecommerce` ability)
- **Request Body** (all fields optional):
```json
{
  "name": "Apple Inc.",
  "slug": "apple-inc",
  "image": "https://example.com/apple-logo.png",
  "description": "Updated brand description",
  "isActive": true
}
```
- **Responses**:
  - `200 OK`: Returns updated brand object.
  - `400 Bad Request`: Invalid UUID format or invalid field values.
  - `404 Not Found`: Brand with specified UUID not found.
  - `409 Conflict`: New slug or name already in use by another brand.

### 7.3. List Brands

- **Method**: `GET`
- **Path**: `/brands` (also `/api/brands`)
- **Access**: Public
- **Query Parameters**:
  - `search` (optional string): case-insensitive search in name and description
  - `isActive` (optional boolean): `true` or `false`
  - `page` (optional integer, default 1)
  - `limit` (optional integer, default 10, max 100)
- **Response**: `200 OK` with paginated list and metadata.

### 7.4. Get Single Brand

- **Method**: `GET`
- **Path**: `/brands/:id` (also `/api/brands/:id`)
- **Access**: Public
- **Param**: UUID or unique slug
- **Response**: `200 OK` with brand object, or `404 Not Found`.
