CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"image" text,
	"color" text,
	"parent_id" uuid,
	CONSTRAINT "categories_no_self_reference_check" CHECK ("id" <> "parent_id")
);
--> statement-breakpoint
CREATE TABLE "set_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "set_category_product_id_category_id_unique" UNIQUE("product_id","category_id")
);
--> statement-breakpoint
CREATE INDEX "categories_parent_id_idx" ON "categories" ("parent_id");--> statement-breakpoint
CREATE INDEX "set_category_product_id_idx" ON "set_category" ("product_id");--> statement-breakpoint
CREATE INDEX "set_category_category_id_idx" ON "set_category" ("category_id");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "set_category" ADD CONSTRAINT "set_category_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "set_category" ADD CONSTRAINT "set_category_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE;