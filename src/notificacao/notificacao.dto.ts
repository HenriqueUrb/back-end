import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
  
  export class NotificacaoDto {
    @IsUUID()
    @IsOptional()
    id: string;
  
    @IsString()
    @IsNotEmpty()
    descricao: string;
  
    @IsString()
    @IsNotEmpty()
    tipo: string;

    @IsDate()
    @IsNotEmpty()
    data: Date;

    @IsBoolean()
    @IsNotEmpty()
    lido: Boolean;

    @IsUUID()
    @IsNotEmpty()
    usuario: UsuarioEntity;
  }
  