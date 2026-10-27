CREATE TABLE "refresh_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"token_family_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone,
	"ip_address" varchar(45),
	"user_agent" text,
	"device_name" varchar(100)
);
--> statement-breakpoint
CREATE INDEX "refresh_sessions_user_id_idx" ON "refresh_sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_sessions_token_family_id_idx" ON "refresh_sessions" ("token_family_id");--> statement-breakpoint
CREATE INDEX "refresh_sessions_token_hash_idx" ON "refresh_sessions" ("token_hash");--> statement-breakpoint
CREATE INDEX "refresh_sessions_expires_at_idx" ON "refresh_sessions" ("expires_at");--> statement-breakpoint
ALTER TABLE "refresh_sessions" ADD CONSTRAINT "refresh_sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;