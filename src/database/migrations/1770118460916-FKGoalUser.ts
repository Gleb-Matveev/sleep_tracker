import { MigrationInterface, QueryRunner } from "typeorm";

export class FKGoalUser1770118460916 implements MigrationInterface {
    name = 'FKGoalUser1770118460916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal" DROP CONSTRAINT "FK_40bd308ea814964cec7146c6dce"`);
        await queryRunner.query(`ALTER TABLE "goal" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "goal" ADD CONSTRAINT "FK_40bd308ea814964cec7146c6dce" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal" DROP CONSTRAINT "FK_40bd308ea814964cec7146c6dce"`);
        await queryRunner.query(`ALTER TABLE "goal" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "goal" ADD CONSTRAINT "FK_40bd308ea814964cec7146c6dce" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
