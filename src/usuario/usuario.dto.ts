import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDate,
} from 'class-validator';

export class UsuarioDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsDate()
  @IsNotEmpty()
  dataNascimento: Date;

  @IsString()
  @IsNotEmpty()
  senha: string;

  @IsString()
  @IsOptional()
  imagem: string;

  @IsString()
  @IsOptional()
  refresh_token: string | null;

  // Propriedades para recuperação de senha
  @IsString()
  @IsOptional()
  passwordResetCode: string | null;

  @IsDate()
  @IsOptional()
  passwordResetExpiration: Date | null;
}
