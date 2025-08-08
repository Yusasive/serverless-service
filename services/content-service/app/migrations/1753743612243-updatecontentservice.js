"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Updatecontentservice1753743612243 = void 0;
class Updatecontentservice1753743612243 {
    constructor() {
        this.name = "Updatecontentservice1753743612243";
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "content_items" ADD "image_base64" text`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "content_items" DROP COLUMN "image_base64"`);
    }
}
exports.Updatecontentservice1753743612243 = Updatecontentservice1753743612243;
