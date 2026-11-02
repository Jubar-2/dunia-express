CREATE TYPE "collection_rule_action_type" AS ENUM('INCLUDE', 'EXCLUDE');--> statement-breakpoint
CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"description" text,
	"thumbnail" text,
	"status" varchar(50) DEFAULT 'DRAFT' NOT NULL,
	"total_product_number" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"collection_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collection_products_collection_product_unique" UNIQUE("collection_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "collection_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"collection_id" uuid NOT NULL,
	"target_type" varchar(100) NOT NULL,
	"action_type" "collection_rule_action_type" DEFAULT 'INCLUDE'::"collection_rule_action_type" NOT NULL,
	"match_type" varchar(50) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conditions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"rule_id" uuid NOT NULL,
	"target_type" varchar(100) NOT NULL,
	"field" varchar(100) NOT NULL,
	"operator" varchar(50) NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_rule_references" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"rule_id" uuid NOT NULL,
	"referenced_collection_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collection_rule_references_rule_ref_unique" UNIQUE("rule_id","referenced_collection_id")
);
--> statement-breakpoint
CREATE INDEX "collections_title_idx" ON "collections" ("title");--> statement-breakpoint
CREATE INDEX "collections_status_idx" ON "collections" ("status");--> statement-breakpoint
CREATE INDEX "collection_products_collection_id_idx" ON "collection_products" ("collection_id");--> statement-breakpoint
CREATE INDEX "collection_products_product_id_idx" ON "collection_products" ("product_id");--> statement-breakpoint
CREATE INDEX "collection_rules_collection_id_idx" ON "collection_rules" ("collection_id");--> statement-breakpoint
CREATE INDEX "collection_rules_position_idx" ON "collection_rules" ("position");--> statement-breakpoint
CREATE INDEX "conditions_rule_id_idx" ON "conditions" ("rule_id");--> statement-breakpoint
CREATE INDEX "collection_rule_refs_rule_id_idx" ON "collection_rule_references" ("rule_id");--> statement-breakpoint
CREATE INDEX "collection_rule_refs_ref_collection_id_idx" ON "collection_rule_references" ("referenced_collection_id");--> statement-breakpoint
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_collection_id_collections_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collection_rules" ADD CONSTRAINT "collection_rules_collection_id_collections_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conditions" ADD CONSTRAINT "conditions_rule_id_collection_rules_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "collection_rules"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collection_rule_references" ADD CONSTRAINT "collection_rule_references_rule_id_collection_rules_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "collection_rules"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "collection_rule_references" ADD CONSTRAINT "collection_rule_references_7GPhsCciwMf7_fkey" FOREIGN KEY ("referenced_collection_id") REFERENCES "collections"("id") ON DELETE CASCADE;