CREATE TABLE "variant_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variant_attribute_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"attribute_id" uuid NOT NULL,
	"value" varchar(255) NOT NULL,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "product_variant_attribute_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_variant_id" uuid NOT NULL,
	"attribute_value_id" uuid NOT NULL,
	CONSTRAINT "product_variant_attribute_values_variant_attribute_unique" UNIQUE("product_variant_id","attribute_value_id")
);
--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "price" SET DATA TYPE numeric(12,2) USING "price"::numeric(12,2);--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "compare_at_price" SET DATA TYPE numeric(12,2) USING "compare_at_price"::numeric(12,2);--> statement-breakpoint
CREATE INDEX "variant_attributes_name_idx" ON "variant_attributes" ("name");--> statement-breakpoint
CREATE INDEX "variant_attribute_values_attribute_id_idx" ON "variant_attribute_values" ("attribute_id");--> statement-breakpoint
CREATE INDEX "product_variant_attr_values_product_variant_id_idx" ON "product_variant_attribute_values" ("product_variant_id");--> statement-breakpoint
CREATE INDEX "product_variant_attr_values_attribute_value_id_idx" ON "product_variant_attribute_values" ("attribute_value_id");--> statement-breakpoint
ALTER TABLE "variant_attribute_values" ADD CONSTRAINT "variant_attribute_values_E74CsPrk2kW2_fkey" FOREIGN KEY ("attribute_id") REFERENCES "variant_attributes"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_variant_attribute_values" ADD CONSTRAINT "product_variant_attribute_values_uMqTGoFBpvQM_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_variant_attribute_values" ADD CONSTRAINT "product_variant_attribute_values_NSS5h5lX92rY_fkey" FOREIGN KEY ("attribute_value_id") REFERENCES "variant_attribute_values"("id") ON DELETE CASCADE;