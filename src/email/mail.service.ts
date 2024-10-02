import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Configure o transporte do Nodemailer
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',  // Exemplo de host, substitua pelo seu servidor de e-mails
      port: 587,
      secure: false,  // true para 465, false para outros
      auth: {
        user: 'contatotribofit@gmail.com',  // Substitua com seu e-mail ou usuário
        pass: 'jxcw dosh zuud mvkj',  // Substitua com sua senha
      },
    });
  }

  private getTemplatePath(filename: string): string {
    return path.join(process.cwd(), 'src', 'email', 'templates', filename);
  }

  async sendMail(mailOptions: { to: string, subject: string, html: string }) {
    const { to, subject, html } = mailOptions;

    const options = {
      from: '"Contato TriboFit" <contatotribofit@gmail.com>', // Seu e-mail
      to: to,
      subject: subject,
      html,
    };

    // Envia o e-mail
    await this.transporter.sendMail(options);
  }

  async sendPasswordResetCodeMail(email: string, resetCode: string, nome: string) {
    const templatePath = this.getTemplatePath('reset-password-template.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html.replace('{{resetCode}}', resetCode);
    html = html.replace('{{nome}}', nome);

    await this.sendMail({
      to: email,
      subject: 'Código de Redefinição de Senha',
      html,
    });
  }

  async sendPasswordChangedMail(email: string, nome: string) {
    const templatePath = this.getTemplatePath('alteracao-senha.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html.replace('{{nomeUsuario}}', nome);

    await this.sendMail({
      to: email,
      subject: 'Você alterou sua senha',
      html,
    });
  }

  async sendSolicitacaoParticipacao(email: string, nomeAdmin: string, nomeEvento: string) {
    const templatePath = this.getTemplatePath('solicitacao-participacao.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html.replace('{{nomeAdmin}}', nomeAdmin);
    html = html.replace('{{nomeEvento}}', nomeEvento )

    await this.sendMail({
      to: email,
      subject: 'Um usuário solicitou participação em seu evento',
      html,
    });
  }

  async sendAvisoEventoAprovado(email: string, nomeAdmin: string, nomeEvento: string) {
    const templatePath = this.getTemplatePath('evento-aprovado.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html.replace('{{nomeUsuario}}', nomeAdmin);
    html = html.replace('{{nomeEvento}}', nomeEvento )

    await this.sendMail({
      to: email,
      subject: 'Seu evento foi aprovado',
      html,
    });
  }

  async sendAvisoEventoReprovado(email: string, nomeAdmin: string, nomeEvento: string) {
    const templatePath = this.getTemplatePath('evento-reprovado.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html.replace('{{nomeUsuario}}', nomeAdmin);
    html = html.replace('{{nomeEvento}}', nomeEvento )

    await this.sendMail({
      to: email,
      subject: 'Seu evento foi reprovado',
      html,
    });
  }

  async sendAvisoEventoCancelado(email: string, nomeUsuario: string, nomeEvento: string) {
    const templatePath = this.getTemplatePath('evento-cancelado.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html.replace('{{nomeUsuario}}', nomeUsuario);
    html = html.replace('{{nomeEvento}}', nomeEvento )

    await this.sendMail({
      to: email,
      subject: 'Seu evento foi cancelado',
      html,
    });
  }

  async sendAvisoParticipacaoAprovada(email: string, nomeUsuario: string, nomeEvento: string) {
    const templatePath = this.getTemplatePath('participacao-aprovada.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html.replace('{{nomeUsuario}}', nomeUsuario);
    html = html.replace('{{nomeEvento}}', nomeEvento )

    await this.sendMail({
      to: email,
      subject: 'Seu participação no evento foi aprovada',
      html,
    });
  }

  async sendAvisoParticipacaoReprovada(email: string, nomeUsuario: string, nomeEvento: string) {
    const templatePath = this.getTemplatePath('participacao-reprovada.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html.replace('{{nomeUsuario}}', nomeUsuario);
    html = html.replace('{{nomeEvento}}', nomeEvento )

    await this.sendMail({
      to: email,
      subject: 'Seu participação no evento foi reprovada',
      html,
    });
  }

}
