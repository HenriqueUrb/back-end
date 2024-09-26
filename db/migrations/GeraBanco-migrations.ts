import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1725326337496 implements MigrationInterface {
    name = 'Migrations1725326337496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "evento_usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status_participante" character varying(1) NOT NULL, "eventoId" uuid, "usuarioId" uuid, CONSTRAINT "PK_dc5a3b4e4004dbf29ed97974804" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuario" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "data_nascimento" TIMESTAMP NOT NULL, "senha" character varying(255) NOT NULL, "imagem" character varying(100), "acesso" character varying(10) NOT NULL,refreshtoken text, "cidadeId" uuid, CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cidade" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "estado" character(2) NOT NULL, CONSTRAINT "PK_9fefdadd1d47000e7fa6d2abc8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "evento" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "titulo" character varying(100) NOT NULL, "descricao" text NOT NULL, "tipo" character varying(100) NOT NULL, "data" TIMESTAMP NOT NULL, "hora" TIME, "dia_semana" character varying, "quantidade_participantes" integer NOT NULL, "latitude" character varying, "longitude" character varying, "imagem" text, "admin" character varying, "bairro" character varying NOT NULL, "rua" character varying NOT NULL, "numero" character varying, "complemento" character varying, "status" character varying NOT NULL, "status_aprovacao" character varying NOT NULL, "cidadeId" uuid, "modalidadeId" uuid, CONSTRAINT "PK_ceb2e9607555230aee6aff546b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "modalidade" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(100) NOT NULL, "icone" character varying(40), CONSTRAINT "PK_6ed9e01b68c48e129e0e41fc202" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notificacao" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descricao" character varying(200) NOT NULL, "tipo" character varying(15) NOT NULL, "data" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "lido" boolean NOT NULL DEFAULT false, "usuarioId" uuid, CONSTRAINT "PK_9f458a7f1d253ab2c6d765d06aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notificacao" ADD CONSTRAINT "FK_9fea26f6e3571a9881f7f068d0b" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evento_usuarios" ADD CONSTRAINT "FK_9fea26f6e3571a9881f7f068d0a" FOREIGN KEY ("eventoId") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evento_usuarios" ADD CONSTRAINT "FK_ce698d429ab5ca93753b1ea0bd1" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD CONSTRAINT "FK_f15ef5e406fe408e921573c7ad8" FOREIGN KEY ("cidadeId") REFERENCES "cidade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evento" ADD CONSTRAINT "FK_245693914452ab1f730af0cfb1c" FOREIGN KEY ("cidadeId") REFERENCES "cidade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evento" ADD CONSTRAINT "FK_6703a705bc477df2e419304adc3" FOREIGN KEY ("modalidadeId") REFERENCES "modalidade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "evento" DROP CONSTRAINT "FK_6703a705bc477df2e419304adc3"`);
        await queryRunner.query(`ALTER TABLE "evento" DROP CONSTRAINT "FK_245693914452ab1f730af0cfb1c"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP CONSTRAINT "FK_f15ef5e406fe408e921573c7ad8"`);
        await queryRunner.query(`ALTER TABLE "evento_usuarios" DROP CONSTRAINT "FK_ce698d429ab5ca93753b1ea0bd1"`);
        await queryRunner.query(`ALTER TABLE "evento_usuarios" DROP CONSTRAINT "FK_9fea26f6e3571a9881f7f068d0a"`);
        await queryRunner.query(`ALTER TABLE "notificacao" DROP CONSTRAINT "FK_9fea26f6e3571a9881f7f068d0b"`);
        await queryRunner.query(`DROP TABLE "modalidade"`);
        await queryRunner.query(`DROP TABLE "evento"`);
        await queryRunner.query(`DROP TABLE "cidade"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TABLE "evento_usuarios"`);
        await queryRunner.query(`DROP TABLE "notificacao"`);
    }
}
