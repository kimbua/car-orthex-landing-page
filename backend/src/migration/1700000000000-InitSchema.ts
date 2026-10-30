import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "cars" (
        "id" SERIAL NOT NULL,
        "slug" character varying(120) NOT NULL,
        "name" character varying(120) NOT NULL,
        "model_line" character varying(60) NOT NULL,
        "variant" character varying(80) NOT NULL,
        "badge" character varying(60) NOT NULL DEFAULT '',
        "series" character varying(20) NOT NULL,
        "category" character varying(40) NOT NULL,
        "fuel" character varying(20) NOT NULL,
        "is_m" boolean NOT NULL DEFAULT false,
        "year" integer NOT NULL,
        "price" bigint,
        "price_note" character varying(200),
        "short_desc" text NOT NULL,
        "description" text NOT NULL,
        "hero_image" character varying(300) NOT NULL,
        "gallery_exterior" jsonb NOT NULL,
        "gallery_interior" jsonb NOT NULL,
        "specs" jsonb NOT NULL,
        "source_url" character varying(300) NOT NULL,
        "source_name" character varying(120) NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_cars" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cars_slug" ON "cars" ("slug")`,
    );

    await queryRunner.query(`
      CREATE TABLE "dealers" (
        "id" SERIAL NOT NULL,
        "name" character varying(120) NOT NULL,
        "city" character varying(80) NOT NULL,
        "address" character varying(250) NOT NULL,
        "phone" character varying(30) NOT NULL,
        "hours" character varying(80) NOT NULL,
        "lat" double precision NOT NULL,
        "lng" double precision NOT NULL,
        "is_service_center" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_dealers" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "test_drive_leads" (
        "id" SERIAL NOT NULL,
        "full_name" character varying(120) NOT NULL,
        "phone" character varying(30) NOT NULL,
        "email" character varying(150),
        "model_slug" character varying(120) NOT NULL,
        "dealer_id" integer,
        "preferred_date" character varying(20),
        "preferred_time" character varying(20),
        "message" text,
        "status" character varying(30) NOT NULL DEFAULT 'new',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_test_drive_leads" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_leads_model_slug" ON "test_drive_leads" ("model_slug")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "test_drive_leads"`);
    await queryRunner.query(`DROP TABLE "dealers"`);
    await queryRunner.query(`DROP TABLE "cars"`);
  }
}
