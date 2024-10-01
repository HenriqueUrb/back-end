import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EventoEntity } from './evento.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventoDto } from './evento.dto';
import { EventoUsuarioEntity } from 'src/evento_usuario/evento_usuario.entity';
import * as fs from 'fs';
import * as path from 'path';
import { MailService } from 'src/email/mail.service';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(EventoEntity)
    private eventoRepository: Repository<EventoEntity>,
    @InjectRepository(UsuarioEntity)
    private usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(EventoUsuarioEntity)
    private eventoUsuarioRepository: Repository<EventoUsuarioEntity>,
    private mailService: MailService
  ) { }

  findAll() {
    return this.eventoRepository.find({
      relations: ['cidade', 'modalidade', 'eventosUsuarios', 'eventosUsuarios.usuario'],
    });
  }

  findEventosAprov() {
    return this.eventoRepository.find({
      where: { status_aprov: 'A' },
      relations: ['cidade', 'modalidade', 'eventosUsuarios', 'eventosUsuarios.usuario'],
    });
  }

  async countEventosPend() {
    return this.eventoRepository.count({ where: { status_aprov: 'P' } });
  }

  async findMeusEventos(userId: string): Promise<EventoEntity[]> {
    return this.eventoRepository.createQueryBuilder('evento')
      .leftJoinAndSelect('evento.cidade', 'cidade')
      .leftJoinAndSelect('evento.modalidade', 'modalidade')
      .leftJoinAndSelect('evento.eventosUsuarios', 'eventosUsuarios')
      .leftJoinAndSelect('eventosUsuarios.usuario', 'usuario')
      .where('evento.admin = :userId', { userId })
      .orWhere('eventosUsuarios.usuario.id = :userId::uuid', { userId })
      .getMany();
  }


  async getSolicitacoesPendentes(userId: string): Promise<EventoEntity[]> {
    return this.eventoRepository.createQueryBuilder('evento')
      .leftJoinAndSelect('evento.cidade', 'cidade')
      .leftJoinAndSelect('evento.modalidade', 'modalidade')
      .leftJoinAndSelect('evento.eventosUsuarios', 'eventosUsuarios')
      .leftJoinAndSelect('eventosUsuarios.usuario', 'usuario')
      .where('evento.admin = :userId', { userId })
      .andWhere('eventosUsuarios.statusParticipante = :status', { status: 'P' })
      .getMany();
  }

  async findPagination(page: number, limit: number) {
    const [result, total] = await this.eventoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['cidade', 'modalidade', 'eventosUsuarios', 'eventosUsuarios.usuario'],
    });

    return {
      data: result,
      count: total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<EventoEntity> {
    const findOne = await this.eventoRepository.findOne({
      where: { id },
      relations: ['cidade', 'modalidade', 'eventosUsuarios', 'eventosUsuarios.usuario'],
    });
    if (!findOne) {
      throw new NotFoundException('Evento não encontrado com o id ' + id);
    }
    return findOne;
  }

  async remove(id: string) {
    const findById = await this.findById(id);
    await this.eventoRepository.remove(findById);
    return { ...findById, id };
  }

  async create(dto: EventoDto) {
    await this.validaEvento(dto);

    const admin = await this.usuarioRepository.findOne({ where: { id: dto.admin } });
    if (!admin) {
      throw new NotFoundException('Admin não encontrado');
    }

    const newEvento = this.eventoRepository.create(dto);
    const savedEvento = await this.eventoRepository.save(newEvento);

    const eventoUsuarioAdmin = new EventoUsuarioEntity();
    eventoUsuarioAdmin.evento = savedEvento;
    eventoUsuarioAdmin.usuario = admin;
    eventoUsuarioAdmin.statusParticipante = 'A';

    await this.eventoUsuarioRepository.save(eventoUsuarioAdmin);

    return savedEvento;
  }

  async update(dto: EventoDto) {
    await this.validaEvento(dto);

    const existingEvento = await this.findById(dto.id);

    const updatedEvento = this.eventoRepository.merge(existingEvento, dto);

    await this.eventoRepository.save(updatedEvento);

    if (dto.usuarios && dto.usuarios.length > 0) {
      await this.eventoUsuarioRepository.delete({ evento: updatedEvento });

      const eventoUsuarios = dto.usuarios.map(dtoUsuario => {
        const eventoUsuario = new EventoUsuarioEntity();
        eventoUsuario.evento = updatedEvento;
        eventoUsuario.usuario = dtoUsuario.usuario;
        eventoUsuario.statusParticipante = dtoUsuario.statusParticipante;
        return eventoUsuario;
      });

      await this.eventoUsuarioRepository.save(eventoUsuarios);
    }

    return updatedEvento;
  }

  async updateEventoUsuarios(dto: EventoDto) {
    await this.validaEvento(dto);

    const existingEvento = await this.findById(dto.id);
      const admin = await this.usuarioRepository.findOne({ where: { id: dto.admin } });


    if (dto.usuarios && dto.usuarios.length > 0) {
      await this.eventoUsuarioRepository.delete({ evento: existingEvento });

      const eventoUsuarios = dto.usuarios.map(dtoUsuario => {
        const eventoUsuario = new EventoUsuarioEntity();
        eventoUsuario.evento = { id: dto.id } as EventoEntity;
        eventoUsuario.usuario = dtoUsuario.usuario;
        eventoUsuario.statusParticipante = dtoUsuario.statusParticipante;
          
    
        return eventoUsuario;
      });

      await this.eventoUsuarioRepository.save(eventoUsuarios);
    }

      

      this.mailService.sendSolicitacaoParticipacao(admin.email, admin.nome, "Solicitante", dto.titulo);

      

    return existingEvento;
  }

  private async validaEvento(evento: EventoDto) {
    this.validaPrenchimentoCampos(evento);
    this.validaSeExisteParticipante(evento);
    if (!evento.id) {
      this.validaDataEvento(evento);
    }
    await this.validaStatusEvento(evento);
    this.validaTipoEvento(evento);
    this.validaDescricao(evento);
  }

  private validaDataEvento(evento: EventoEntity | EventoDto) {
    const dataAtual = new Date();
    const dataEvento = new Date(evento.data);
    if (dataEvento < dataAtual && evento.tipo == 'não recorrente') {
      throw new BadRequestException(
        'Para eventos não recorrentes, a data do evento deve ser maior ou igual à que a data atual.',
      );
    }
  }

  private validaTipoEvento(evento: EventoEntity | EventoDto) {
    if (evento.tipo === 'recorrente' && !evento.diaSemana) {
      throw new BadRequestException(
        'Para eventos recorrentes, é necessário preencher o campo Dia da semana.',
      );
    }
  }

  private validaDescricao(evento: EventoEntity | EventoDto) {
    if (evento.descricao.length < 20) {
      throw new BadRequestException(
        'A descrição do evento deve ter no mínimo 20 caracteres.',
      );
    }
  }

  private validaSeExisteParticipante(evento: EventoDto) {
    if (evento.quantidadeParticipantes < 1) {
      throw new BadRequestException(
        'Limite mínimo de 1 participante no evento.',
      );
    }
  }

  private validaStatusEvento(dto: EventoDto) {
    const statusInativos = ['I'];
    if (statusInativos.includes(dto.status.toUpperCase())) {
      throw new BadRequestException(
        'Não é permitido criar ou alterar eventos inativos',
      );
    }
  }

  private validaPrenchimentoCampos(evento: EventoDto) {
    if (!evento.titulo || !evento.descricao || !evento.tipo || !evento.data) {
      throw new BadRequestException(
        'Alguns campos obrigatórios não foram preenchidos.',
      );
    }
  }

  async updateStatus(id: string, status: string) {
    const evento = await this.findById(id);
  
    const oldStatus = evento.status_aprov;
    evento.status_aprov = status.toUpperCase();
    await this.eventoRepository.save(evento);
  
    const admin = await this.usuarioRepository.findOne({ where: { id: evento.admin } });
  
    // Envia e-mail apenas se o status mudou de "pendente" para "aprovado"
    if (oldStatus !== 'A' && evento.status_aprov === 'A' && admin) {
      await this.mailService.sendAvisoEventoAprovado(admin.email, admin.nome, evento.titulo);
    }
    
    // Envia e-mail se o status mudou para "reprovado" (por exemplo, status 'R')
    else if (oldStatus !== 'R' && evento.status_aprov === 'R' && admin) {
      await this.mailService.sendAvisoEventoReprovado(admin.email, admin.nome, evento.titulo);
    }
  
    return evento;
  }
  
  
  
  
}
