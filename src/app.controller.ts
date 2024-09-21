import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MailService } from './email/mail.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private mailService: MailService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
