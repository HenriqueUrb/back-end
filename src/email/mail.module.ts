import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],  // Exporte o serviço para ser usado em outros módulos
})
export class MailModule {}
