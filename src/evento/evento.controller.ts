import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common';

import { EventoService } from './evento.service';
import { EventoDto } from './evento.dto';
import { EventoUsuarioEntity } from 'src/evento_usuario/evento_usuario.entity';

@Controller('eventos')
export class EventoController {
  constructor(private eventoService: EventoService) { }

  @Get()
  findAll() {
    return this.eventoService.findAll();
  }

  @Get('aprovados')
  findEventosAprov() {
    return this.eventoService.findEventosAprov();
  }

  @Get('pendentes')
  countPendingEvents() {
    return this.eventoService.countEventosPend();
  }

  @Get('meus-eventos')
  findMeusEventos(@Query('userId') userId: string) {
    return this.eventoService.findMeusEventos(userId);
  }

  @Get('solicitacoes-pendentes')
  findSolicitacoesPendentes(@Query('userId') userId: string) {
    return this.eventoService.getSolicitacoesPendentes(userId);
  }

  @Get('pagination')
  findPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.eventoService.findPagination(page, limit);
  }


  @Put(':id/usuarios')
  async updateEventoUsuarios(@Param('id') id: string, @Body() dto: EventoDto) {
    return this.eventoService.updateEventoUsuarios({ id, ...dto });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.eventoService.findById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventoService.remove(id);
  }

  @Post()
  create(@Body() dto: EventoDto) {
    return this.eventoService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: EventoDto) {
    return this.eventoService.update({ id, ...dto });
  }

  @Put(':id/status-aprovacao')
  async updateStatusAprovacao(@Param('id') id: string, @Body('status') status: string) {
    return this.eventoService.updateStatusAprovacao(id, status);
  }

  @Put(':id/status-aprovacao-participante')
  async updateStatusAprovacaoParticipante(@Param('idEventoUsuario') idEventoUsuario: string, @Body('status') status: string) {
    return this.eventoService.updateStatusAprovacaoParticipante(idEventoUsuario, status);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.eventoService.updateStatusEvento(id, status);
  }
}
