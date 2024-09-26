import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CidadeEntity } from 'src/cidade/cidade.entity';
import { EventoUsuarioEntity } from 'src/evento_usuario/evento_usuario.entity';

@Entity({ name: 'usuario' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100 })
  email: string;

  @Column({ name: 'data_nascimento' })
  dataNascimento: Date;

  @Column({ length: 255 })
  senha: string;

  @Column({ length: 100, nullable: true })
  imagem: string;

  @Column({ length: 10 })
  acesso: string;

  @ManyToOne(() => CidadeEntity, cidade => cidade.usuarios)
  cidade: CidadeEntity;

  @OneToMany(() => EventoUsuarioEntity, eventoUsuario => eventoUsuario.usuario)
  eventosUsuarios: EventoUsuarioEntity[];

  @Column({ type: 'text', nullable: true })
  refreshtoken: string | null;

  // Adicionando as colunas para o código de redefinição de senha e data de expiração
  @Column({ type: 'text', nullable: true })
  passwordResetCode: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  passwordResetExpiration: Date | null;
}

