DO $$ BEGIN
  CREATE TYPE "product_status" AS ENUM('ACTIVE', 'DRAFT', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roll" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"module_name" text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roll_junction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"roll_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "roll_junction_roll_id_permission_id_unique" UNIQUE("roll_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brand" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL UNIQUE,
	"logo" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL UNIQUE,
	"description" text,
	"regular_price" numeric(10,2) NOT NULL,
	"offer_price" numeric(10,2),
	"status" "product_status" DEFAULT 'DRAFT'::"product_status" NOT NULL,
	"brand_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"sku" varchar(100) NOT NULL UNIQUE,
	"price" numeric(10,2) NOT NULL,
	"compare_at_price" numeric(10,2),
	"quantity" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"variant_id" uuid,
	"url" text NOT NULL,
	"alt_text" varchar(255),
	"is_thumbnail" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN "roll" uuid;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "roll_name_idx" ON "roll" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "brand_name_idx" ON "brand" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_slug_idx" ON "products" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_brand_id_idx" ON "products" ("brand_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_status_idx" ON "products" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_variants_product_id_idx" ON "product_variants" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_variants_sku_idx" ON "product_variants" ("sku");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_images_product_id_idx" ON "product_images" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_images_variant_id_idx" ON "product_images" ("variant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_images_is_thumbnail_idx" ON "product_images" ("is_thumbnail");--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "roll_junction" ADD CONSTRAINT "roll_junction_roll_id_roll_id_fkey" FOREIGN KEY ("roll_id") REFERENCES "roll"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "roll_junction" ADD CONSTRAINT "roll_junction_permission_id_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "users" ADD CONSTRAINT "users_roll_roll_id_fkey" FOREIGN KEY ("roll") REFERENCES "roll"("id") ON DELETE RESTRICT;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brand"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "product_images" ADD CONSTRAINT "product_images_variant_id_product_variants_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;