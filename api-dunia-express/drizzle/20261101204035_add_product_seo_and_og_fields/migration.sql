ALTER TABLE "products" ADD COLUMN "meta_title" varchar(255);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "meta_keywords" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "og_title" varchar(255);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "og_description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "og_image" text;