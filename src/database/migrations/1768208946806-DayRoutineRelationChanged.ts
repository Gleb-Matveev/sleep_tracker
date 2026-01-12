import { MigrationInterface, QueryRunner } from "typeorm";

export class DayRoutineRelationChanged1768208946806 implements MigrationInterface {
    name = 'DayRoutineRelationChanged1768208946806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day_routines" DROP CONSTRAINT "FK_3c352dd71dc7a0258e5b66ccc1e"`);
        await queryRunner.query(`ALTER TABLE "day_routines" DROP CONSTRAINT "FK_a53addf071c6294dc2ea79e3f18"`);
        await queryRunner.query(`ALTER TABLE "day_routines" ADD CONSTRAINT "FK_3c352dd71dc7a0258e5b66ccc1e" FOREIGN KEY ("dayId") REFERENCES "day"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day_routines" ADD CONSTRAINT "FK_a53addf071c6294dc2ea79e3f18" FOREIGN KEY ("routineId") REFERENCES "routine"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day_routines" DROP CONSTRAINT "FK_a53addf071c6294dc2ea79e3f18"`);
        await queryRunner.query(`ALTER TABLE "day_routines" DROP CONSTRAINT "FK_3c352dd71dc7a0258e5b66ccc1e"`);
        await queryRunner.query(`ALTER TABLE "day_routines" ADD CONSTRAINT "FK_a53addf071c6294dc2ea79e3f18" FOREIGN KEY ("routineId") REFERENCES "routine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day_routines" ADD CONSTRAINT "FK_3c352dd71dc7a0258e5b66ccc1e" FOREIGN KEY ("dayId") REFERENCES "day"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
