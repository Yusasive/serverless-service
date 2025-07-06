import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1749095438112 implements MigrationInterface {
    name = 'InitialMigration1749095438112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "content_sections" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "section_key" character varying(100) NOT NULL,
                "title" character varying(200) NOT NULL,
                "content" text NOT NULL,
                "metadata" json,
                "is_active" boolean NOT NULL DEFAULT true,
                "display_order" integer NOT NULL DEFAULT '0',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_content_sections_section_key" UNIQUE ("section_key"),
                CONSTRAINT "PK_content_sections" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "content_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "section_id" uuid NOT NULL,
                "title" character varying(200) NOT NULL,
                "description" text,
                "image_url" character varying(500),
                "link_url" character varying(500),
                "metadata" json,
                "is_active" boolean NOT NULL DEFAULT true,
                "display_order" integer NOT NULL DEFAULT '0',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_content_items" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "testimonials" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(200) NOT NULL,
                "title" character varying(200) NOT NULL,
                "content" text NOT NULL,
                "image_url" character varying(500),
                "date" character varying(50),
                "is_active" boolean NOT NULL DEFAULT true,
                "display_order" integer NOT NULL DEFAULT '0',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_testimonials" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "faqs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "category" character varying(100) NOT NULL,
                "question" character varying(500) NOT NULL,
                "answer" text NOT NULL,
                "metadata" json,
                "is_active" boolean NOT NULL DEFAULT true,
                "display_order" integer NOT NULL DEFAULT '0',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_faqs" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "content_items" 
            ADD CONSTRAINT "FK_content_items_section_id" 
            FOREIGN KEY ("section_id") REFERENCES "content_sections"("id") 
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_items" DROP CONSTRAINT "FK_content_items_section_id"`);
        await queryRunner.query(`DROP TABLE "faqs"`);
        await queryRunner.query(`DROP TABLE "testimonials"`);
        await queryRunner.query(`DROP TABLE "content_items"`);
        await queryRunner.query(`DROP TABLE "content_sections"`);
    }
}