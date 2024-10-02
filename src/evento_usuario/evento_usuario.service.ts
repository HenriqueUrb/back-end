import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventoUsuarioEntity } from 'src/evento_usuario/evento_usuario.entity';

@Injectable()
export class EventoUsuarioService {
  constructor(
    @InjectRepository(EventoUsuarioEntity)
    private eventoUsuarioRepository: Repository<EventoUsuarioEntity>,
  ) { }

  async findById(id: string): Promise<EventoUsuarioEntity> {
    const findOne = await this.eventoUsuarioRepository.findOne({
      where: { id },
      relations: ['evento', 'eventosUsuarios', 'eventosUsuarios.usuario'],
    });
    if (!findOne) {
      throw new NotFoundException('Evento usuário não encontrado com o id ' + id);
    }
    return findOne;
  }
}