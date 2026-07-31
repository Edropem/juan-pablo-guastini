import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "home" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_hero_image_idx" ON "home" USING btree ("hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" DROP CONSTRAINT "home_hero_image_id_media_id_fk";
  
  DROP INDEX "home_hero_image_idx";
  ALTER TABLE "home" DROP COLUMN "hero_image_id";
  ALTER TABLE "home" DROP COLUMN "cta_href";`)
}
