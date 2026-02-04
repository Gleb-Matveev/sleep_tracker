import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAvatarUrl1770194651156 implements MigrationInterface {
    name = 'UserAvatarUrl1770194651156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar_url"`);
    }

}
