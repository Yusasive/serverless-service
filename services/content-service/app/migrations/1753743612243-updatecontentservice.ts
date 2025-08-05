import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatecontentservice1753743612243 implements MigrationInterface {
    name = 'Updatecontentservice1753743612243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "content_items" DROP CONSTRAINT "FK_content_items_section_id"`);
        await queryRunner.query(`ALTER TABLE "content_items" ADD "image_base64" text`);
        // await queryRunner.query(`ALTER TABLE "content_items" ADD CONSTRAINT "FK_a0f0eed957f76634a5b8875dc8d" FOREIGN KEY ("section_id") REFERENCES "content_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "content_items" DROP CONSTRAINT "FK_a0f0eed957f76634a5b8875dc8d"`);
        await queryRunner.query(`ALTER TABLE "content_items" DROP COLUMN "image_base64"`);
        // await queryRunner.query(`ALTER TABLE "content_items" ADD CONSTRAINT "FK_content_items_section_id" FOREIGN KEY ("section_id") REFERENCES "content_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
