import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  
  constructor(
    private usersService: UsuarioService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string,): Promise<{ access_token: string }> {

    const user = await this.usersService.findByEmail(email);
    console.log(email, pass);
    if (user?.senha !== pass) {
      console.log(user?.senha, pass)
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}