CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_preferences_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"emailUpdates" boolean DEFAULT false NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_role" "user_role" DEFAULT 'USER' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_index" ON "users" USING btree ("email");