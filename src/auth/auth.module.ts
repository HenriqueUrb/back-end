import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { HashService } from 'src/usuario/hash.service';
import { MailModule } from 'src/email/mail.module';

@Module({
  imports: [
    UsuarioModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' }, // expiração do access token
    }),
    MailModule, // Importando o MailModule
  ],
  providers: [
    AuthService,
    HashService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
