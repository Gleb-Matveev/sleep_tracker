import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserContraints1766404736508 implements MigrationInterface {
    name = 'AddUserContraints1766404736508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "routine" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "day" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "goal" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "rule" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "routine" ADD CONSTRAINT "FK_c45924a1b42b6620e435e677cb5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day" ADD CONSTRAINT "FK_99916fb808e6987fc50c7219d1a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goal" ADD CONSTRAINT "FK_40bd308ea814964cec7146c6dce" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rule" ADD CONSTRAINT "FK_865c6ac4d72b3976004f5e19f9b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rule" DROP CONSTRAINT "FK_865c6ac4d72b3976004f5e19f9b"`);
        await queryRunner.query(`ALTER TABLE "goal" DROP CONSTRAINT "FK_40bd308ea814964cec7146c6dce"`);
        await queryRunner.query(`ALTER TABLE "day" DROP CONSTRAINT "FK_99916fb808e6987fc50c7219d1a"`);
        await queryRunner.query(`ALTER TABLE "routine" DROP CONSTRAINT "FK_c45924a1b42b6620e435e677cb5"`);
        await queryRunner.query(`ALTER TABLE "rule" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "day" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "routine" DROP COLUMN "userId"`);
    }

}
