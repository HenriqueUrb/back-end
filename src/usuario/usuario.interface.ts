import { Cidade } from "src/cidade/cidade.interface";

export interface Usuario {
  id?: string | null;
  nome: string;
  email: string;
  dataNascimento: Date;
  senha: string;
  cidade: Cidade;
  eventos: string[];
  acesso: string;
  imagem: string;
  
  // Propriedades para tokens e recuperação de senha
  refreshtoken?: string | null;
  passwordResetCode?: string | null;
  passwordResetExpiration?: Date | null;
}
