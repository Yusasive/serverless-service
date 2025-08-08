"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddImageUrlToContentSections1754598718644 = void 0;
class AddImageUrlToContentSections1754598718644 {
    constructor() {
        this.name = 'AddImageUrlToContentSections1754598718644';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "content_sections" RENAME COLUMN "image_base64" TO "image_url"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "content_sections" RENAME COLUMN "image_url" TO "image_base64"`);
    }
}
exports.AddImageUrlToContentSections1754598718644 = AddImageUrlToContentSections1754598718644;
