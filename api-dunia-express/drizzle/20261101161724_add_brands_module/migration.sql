ALTER TABLE "brand" RENAME TO "brands";--> statement-breakpoint
ALTER TABLE "brands" RENAME COLUMN "logo" TO "image";--> statement-breakpoint
ALTER INDEX "brand_name_idx" RENAME TO "brands_name_idx";--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_slug_key" UNIQUE("slug");--> statement-breakpoint
CREATE INDEX "brands_slug_idx" ON "brands" ("slug");--> statement-breakpoint
CREATE INDEX "brands_is_active_idx" ON "brands" ("is_active");