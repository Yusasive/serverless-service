"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddImageBase64ToTestimonial1753647332519 = void 0;
class AddImageBase64ToTestimonial1753647332519 {
    async up(queryRunner) {
        await queryRunner.query(`
          ALTER TABLE "testimonials"
          ADD COLUMN "image_base64" TEXT
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
        ALTER TABLE "testimonials"
        DROP COLUMN "image_base64"
      `);
    }
}
exports.AddImageBase64ToTestimonial1753647332519 = AddImageBase64ToTestimonial1753647332519;
