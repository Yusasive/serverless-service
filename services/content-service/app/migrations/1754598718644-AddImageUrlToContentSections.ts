import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToContentSections1754598718644 implements MigrationInterface {
    name = 'AddImageUrlToContentSections1754598718644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_sections" RENAME COLUMN "image_base64" TO "image_url"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_sections" RENAME COLUMN "image_url" TO "image_base64"`);
    }

}
