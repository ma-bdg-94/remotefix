import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCheckSubItemsConstraint1727193172238 implements MigrationInterface {
    name = 'AddCheckSubItemsConstraint1727193172238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menu_item" ("id" SERIAL NOT NULL, "position" integer NOT NULL, "label" text NOT NULL, "link" character varying(20) NOT NULL, "is_private" boolean NOT NULL DEFAULT false, "icon" character varying(255), "scope" character varying(255) array NOT NULL, "subItems" integer array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP, "archived" boolean NOT NULL DEFAULT false, "archived_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_722c4de0accbbfafc77947a8556" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "menu_item"`);
    }

}
