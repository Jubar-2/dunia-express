CREATE TYPE "user_status" AS ENUM('active', 'suspended', 'pending');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar(255) NOT NULL UNIQUE,
	"password" text NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"phone" varchar(30),
	"avatar" text,
	"status" "user_status" DEFAULT 'active'::"user_status",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
