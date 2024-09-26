import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.metadata';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    try {
      return await this.authService.refreshtoken(body.refresh_token);
    } catch (error) {
      console.error('Erro ao tentar renovar o token:', error.message);
      // Retorne uma resposta 401 para indicar que o token expirou
      throw new UnauthorizedException('O refresh token expirou, faça login novamente.');
    }
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('esqueceu-senha')
  async forgotPassword(@Body('email') email: string) {
    await this.authService.generatePasswordResetCode(email);
    return { message: 'Se o e-mail estiver cadastrado, você receberá um e-mail com instruções para redefinir sua senha.' };
  }

  @Public()
  @Post('validar-reset-code')
  async validateResetCode(@Body() body: { code: string }) {
    const { code } = body;
    return this.authService.validatePasswordResetCode(code);
  }

  @Public()
  @Post('atualizar-senha')
  async resetPassword(@Body() body: { code: string, newPassword: string }) {
    // Valida o código de redefinição de senha, passando o email e o código
    await this.authService.validatePasswordResetCode(body.code);
    
    // Reseta a senha
    await this.authService.resetPassword(body.code, body.newPassword);
    
    return { message: 'Senha alterada com sucesso' };
  }
  
}
