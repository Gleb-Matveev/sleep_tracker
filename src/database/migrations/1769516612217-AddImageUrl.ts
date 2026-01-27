import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrl1769516612217 implements MigrationInterface {
    name = 'AddImageUrl1769516612217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal" ADD "image_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "image_url"`);
    }

}
