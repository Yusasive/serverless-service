import { MigrationInterface, QueryRunner } from "typeorm";

export class Addedcolumntosection1754059119835 implements MigrationInterface {
    name = 'Addedcolumntosection1754059119835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_sections" ADD "image_base64" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_sections" DROP COLUMN "image_base64"`);
    }

}
