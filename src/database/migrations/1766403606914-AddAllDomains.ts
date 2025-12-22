import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAllDomains1766403606914 implements MigrationInterface {
    name = 'AddAllDomains1766403606914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rule" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_a5577f464213af7ffbe866e3cb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "day" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "getup_score" integer NOT NULL, "feeling_score" integer NOT NULL, "wakeUpTime" TIME NOT NULL, "wakeDownTime" TIME NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_42e726f6b72349f70b25598b50e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "day_routines" ("id" SERIAL NOT NULL, "dayId" integer, "routineId" integer, CONSTRAINT "PK_ade1650abe2fa2401283369e321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."routine_period_enum" AS ENUM('Day', 'Night')`);
        await queryRunner.query(`CREATE TABLE "routine" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "period" "public"."routine_period_enum" NOT NULL, "steps" text array NOT NULL DEFAULT '{}', CONSTRAINT "PK_5f1178fd54059b2f9479d6141ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."goal_period_enum" AS ENUM('Done', 'Not done')`);
        await queryRunner.query(`CREATE TABLE "goal" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "period" "public"."goal_period_enum" NOT NULL, CONSTRAINT "PK_88c8e2b461b711336c836b1e130" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "day_routines" ADD CONSTRAINT "FK_3c352dd71dc7a0258e5b66ccc1e" FOREIGN KEY ("dayId") REFERENCES "day"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day_routines" ADD CONSTRAINT "FK_a53addf071c6294dc2ea79e3f18" FOREIGN KEY ("routineId") REFERENCES "routine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day_routines" DROP CONSTRAINT "FK_a53addf071c6294dc2ea79e3f18"`);
        await queryRunner.query(`ALTER TABLE "day_routines" DROP CONSTRAINT "FK_3c352dd71dc7a0258e5b66ccc1e"`);
        await queryRunner.query(`DROP TABLE "goal"`);
        await queryRunner.query(`DROP TYPE "public"."goal_period_enum"`);
        await queryRunner.query(`DROP TABLE "routine"`);
        await queryRunner.query(`DROP TYPE "public"."routine_period_enum"`);
        await queryRunner.query(`DROP TABLE "day_routines"`);
        await queryRunner.query(`DROP TABLE "day"`);
        await queryRunner.query(`DROP TABLE "rule"`);
    }

}
