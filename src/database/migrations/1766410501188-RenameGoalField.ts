import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameGoalField1766410501188 implements MigrationInterface {
    name = 'RenameGoalField1766410501188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal" RENAME COLUMN "period" TO "status"`);
        await queryRunner.query(`ALTER TYPE "public"."goal_period_enum" RENAME TO "goal_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."goal_status_enum" RENAME TO "goal_period_enum"`);
        await queryRunner.query(`ALTER TABLE "goal" RENAME COLUMN "status" TO "period"`);
    }

}
