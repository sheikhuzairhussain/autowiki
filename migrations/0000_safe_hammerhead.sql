CREATE TYPE "public"."project_status" AS ENUM('pending', 'analyzing', 'generating-wiki', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid DEFAULT gen_random_uuid(),
	"url" text NOT NULL,
	"name" text,
	"analysis" jsonb,
	"wiki" jsonb,
	"status" "project_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
