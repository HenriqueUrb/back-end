import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { ModalidadeModule } from './modalidade/modalidade.module';
import { UsuarioModule } from './usuario/usuario.module';
import { EventoModule } from './evento/evento.module';
import { CidadeModule } from './cidade/cidade.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificacaoModule } from './notificacao/notificacao.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './email/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ModalidadeModule,
    UsuarioModule,
    EventoModule,
    CidadeModule,
    AuthModule,
    NotificacaoModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads')
    }),
    MailerModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard
  },
  AppService],
})
export class AppModule { }
