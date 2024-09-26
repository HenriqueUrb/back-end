import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionadoDadosParaRecuperarSenha1725579055986 implements MigrationInterface {
    name = 'AdicionadoDadosParaRecuperarSenha1725579055986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "passwordResetCode" text`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "passwordResetExpiration" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "passwordResetExpiration"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "passwordResetCode"`);
    }

}
