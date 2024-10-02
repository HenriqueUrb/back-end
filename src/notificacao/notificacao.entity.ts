import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notificacao' })
export class NotificacaoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  descricao: string;

  @Column({ length: 15})
  tipo: String;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  data: Date;

  @Column({})
  lido: Boolean;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.eventosUsuarios, { eager: true })
  usuario: UsuarioEntity;
}
