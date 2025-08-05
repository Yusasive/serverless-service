"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Addedcolumntosection1754059119835 = void 0;
class Addedcolumntosection1754059119835 {
    constructor() {
        this.name = 'Addedcolumntosection1754059119835';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "content_sections" ADD "image_base64" text`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "content_sections" DROP COLUMN "image_base64"`);
    }
}
exports.Addedcolumntosection1754059119835 = Addedcolumntosection1754059119835;
