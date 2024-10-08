import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoEntity } from './evento.entity';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { ModalidadeEntity } from 'src/modalidade/modalidade.entity';
import { EventoUsuarioEntity } from 'src/evento_usuario/evento_usuario.entity';
import { UploadService } from 'src/core/upload.service';
import { MailModule } from 'src/email/mail.module';
import { EventoUsuarioService } from 'src/evento_usuario/evento_usuario.service';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventoEntity, UsuarioEntity, ModalidadeEntity,EventoUsuarioEntity]), MailModule, UsuarioModule],
  controllers: [EventoController],
  providers: [EventoService, UploadService, EventoUsuarioService],
})
export class EventoModule {}
