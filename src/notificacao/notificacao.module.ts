import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacaoController } from './notificacao.controller';
import { NotificacaoEntity } from './notificacao.entity';
import { NotificacaoService } from './notificacao.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificacaoEntity])],
  controllers: [NotificacaoController],
  providers: [NotificacaoService],
})
export class NotificacaoModule {}
