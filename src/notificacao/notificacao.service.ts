import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificacaoEntity } from './notificacao.entity';
import { NotificacaoDto } from './notificacao.dto';

@Injectable()
export class NotificacaoService {
  constructor(
    @InjectRepository(NotificacaoEntity)
    private notificacaoRepository: Repository<NotificacaoEntity>,
  ) {}

  findAll() {
    return this.notificacaoRepository.find();
  }

  async findById(id: string): Promise<NotificacaoEntity> {
    const findOne = await this.notificacaoRepository.findOne({ where: { id } });
    if (!findOne) {
      throw new NotFoundException('Notificacao não encontrada com o id ' + id);
    }
    return findOne;
  }

  async findByUser(id: string): Promise<NotificacaoEntity[]> {
    const notificacoes = await this.notificacaoRepository.findBy({ usuario: { id } });
    
    if (!notificacoes || notificacoes.length === 0) {
      throw new NotFoundException(`Nenhuma notificação encontrada para o usuário com o id ${id}`);
    }
    
    return notificacoes;
  }

  async remove(id: string) {
    const findById = await this.findById(id);
    await this.notificacaoRepository.remove(findById);
    return { ...findById, id };
  }

  async create(dto: NotificacaoDto) {
    const newNotificacao = this.notificacaoRepository.create(dto);
    return this.notificacaoRepository.save(newNotificacao);
  }

  async update({ id, ...dto }: NotificacaoDto) {
    await this.findById(id);
    return this.notificacaoRepository.save({ id, ...dto });
  }

  async marcarComoLida(id: string, updateDto: NotificacaoDto): Promise<NotificacaoEntity> {
    const notificacao = await this.findById(id);
    if (!notificacao){
      throw new Error('Notificação não encontrada')
    }

    //atualiza a notificação
    notificacao.lido = true;

    //salva a notificação atualizada no banco
    return this.notificacaoRepository.save(notificacao);

  }
}
