import { MigrationInterface, QueryRunner } from "typeorm";

export class FKRuleUser1770105814811 implements MigrationInterface {
    name = 'FKRuleUser1770105814811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rule" DROP CONSTRAINT "FK_865c6ac4d72b3976004f5e19f9b"`);
        await queryRunner.query(`ALTER TABLE "rule" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_bf750eae37ba60fa4780118615f" UNIQUE ("supertoken_id")`);
        await queryRunner.query(`ALTER TABLE "rule" ADD CONSTRAINT "FK_865c6ac4d72b3976004f5e19f9b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rule" DROP CONSTRAINT "FK_865c6ac4d72b3976004f5e19f9b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_bf750eae37ba60fa4780118615f"`);
        await queryRunner.query(`ALTER TABLE "rule" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rule" ADD CONSTRAINT "FK_865c6ac4d72b3976004f5e19f9b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
