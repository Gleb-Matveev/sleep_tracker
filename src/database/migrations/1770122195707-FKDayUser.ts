import { MigrationInterface, QueryRunner } from "typeorm";

export class FKDayUser1770122195707 implements MigrationInterface {
    name = 'FKDayUser1770122195707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day" DROP CONSTRAINT "FK_99916fb808e6987fc50c7219d1a"`);
        await queryRunner.query(`ALTER TABLE "day" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "day" ADD CONSTRAINT "FK_99916fb808e6987fc50c7219d1a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day" DROP CONSTRAINT "FK_99916fb808e6987fc50c7219d1a"`);
        await queryRunner.query(`ALTER TABLE "day" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "day" ADD CONSTRAINT "FK_99916fb808e6987fc50c7219d1a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
