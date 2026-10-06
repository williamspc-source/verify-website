import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_settings" DROP COLUMN "aamle_callout";
  ALTER TABLE "events_settings" DROP COLUMN "verify_callout";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_settings" ADD COLUMN "aamle_callout" jsonb;
  ALTER TABLE "events_settings" ADD COLUMN "verify_callout" jsonb;`)
}
