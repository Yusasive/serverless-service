import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageBase64ToTestimonial1753647332519
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "testimonials"
          ADD COLUMN "image_base64" TEXT
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "testimonials"
        DROP COLUMN "image_base64"
      `);
  }
}
