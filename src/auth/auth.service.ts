import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/usuario/hash.service';
import { jwtConstants } from './constants';
import { MailService } from 'src/email/mail.service';
import { randomInt } from 'crypto';


@Injectable()
export class AuthService {

  constructor(
    private usersService: UsuarioService,
    private jwtService: JwtService,
    private hashService: HashService,
    private mailService: MailService, 
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string, refresh_token: string }> {
    console.log('Tentando fazer login com o e-mail:', email);

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      console.error('Usuário não encontrado');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await this.hashService.comparePasswords(pass, user.senha);
    if (!passwordMatch) {
      console.error('Senha não confere');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, nome: user.nome, email: user.email, acesso: user.acesso };
    console.log('Payload gerado para os tokens:', payload);

    const access_token = await this.jwtService.signAsync(payload, { expiresIn: '10m' });
    const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '15m' });

    console.log('Tokens gerados:', { access_token, refresh_token });

    // Aqui, salve o refresh_token no banco de dados associado ao usuário
    await this.usersService.saveRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshtoken(refreshtoken: string): Promise<{ access_token: string }> {
    console.log('Tentando renovar o token:', refreshtoken);
  
    try {
      const payload = await this.jwtService.verifyAsync(refreshtoken, { secret: jwtConstants.secret });
      console.log('Payload do token:', payload);
  
      const user = await this.usersService.findById(payload.sub);
      console.log('Usuário recuperado do banco de dados:', user);
  
      if (!user) {
        console.error('Usuário não encontrado');
        throw new UnauthorizedException('Refresh token inválido');
      }
      
      if (refreshtoken !== user.refreshtoken) {
        console.error('Refresh token não corresponde ao token armazenado');
        throw new UnauthorizedException('Refresh token inválido');
      }
  
      const access_token = await this.jwtService.signAsync({ sub: payload.sub, email: payload.email }, { expiresIn: '10m' });
      console.log('Novo access token gerado:', access_token);
  
      return { access_token };
    } catch (err) {
      console.error('Erro ao verificar o refresh token:', err.message);
      if (err.name === 'TokenExpiredError') {
        console.error('Token expirado em:', err.expiredAt);
        throw new UnauthorizedException('O refresh token expirou, faça login novamente.');
      }
      throw new UnauthorizedException('Refresh token inválido');
    }
  }


  async generatePasswordResetCode(email: string): Promise<string> {
    console.log('Gerando código de redefinição para o e-mail:', email);
    const user = await this.usersService.findByEmail(email);
    if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
    }

    // Gera o código de 6 dígitos
    const resetCode = randomInt(100000, 999999).toString();
    console.log('Código gerado:', resetCode);


    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 15); // Expira em 15 minutos
    console.log('Data de expiração:', expirationDate);

    // Salvar o código e data de expiração no banco
    await this.usersService.savePasswordResetCode(user.id, resetCode, expirationDate);

    await this.mailService.sendPasswordResetCodeMail(email, resetCode, user.nome);

    return resetCode;
}

async validatePasswordResetCode(code: string): Promise<boolean> {
  const user = await this.usersService.findByResetCode(code);
  if (!user || !user.passwordResetCode) {
      throw new UnauthorizedException('Código de redefinição inválido');
  }

  const isCodeValid = code === user.passwordResetCode && new Date() < user.passwordResetExpiration;
  if (!isCodeValid) {
      throw new UnauthorizedException('Código de redefinição inválido ou expirado');
  }

  return true;
}


async resetPassword(code: string, newPassword: string): Promise<void> {
  const user = await this.usersService.findByResetCode(code);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const hashedPassword = await this.hashService.hashPassword(newPassword);
    await this.usersService.updatePassword(user.id, hashedPassword);

    await this.mailService.sendPasswordChangedMail(user.email, user.nome);

    // Limpar o código de redefinição após o uso
    await this.usersService.clearPasswordResetCode(user.id);
  }
}
