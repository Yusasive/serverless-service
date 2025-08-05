import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToContentSections implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "content_sections"
        ADD COLUMN "image_url" TEXT;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "content_sections"
        DROP COLUMN "image_url";
      `);
  }
}
