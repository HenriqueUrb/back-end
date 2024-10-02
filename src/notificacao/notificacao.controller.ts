import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';

    import { NotificacaoService } from './notificacao.service';
    import { NotificacaoDto } from './notificacao.dto';
  
  @Controller('notificacoes')
  export class NotificacaoController {
    constructor(private notificacaoService: NotificacaoService) {}
  
    @Get()
    findAll() {
      return this.notificacaoService.findAll();
    }
  
    @Get(':id')
    findById(@Param('id') id: string) {
      return this.notificacaoService.findById(id);
    }

    @Get('usuario/:id')
    findByUser(@Param('id') id: string) {
      return this.notificacaoService.findByUser(id);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.notificacaoService.remove(id);
    }
  
    @Post()
    create(@Body() dto: NotificacaoDto) {
      return this.notificacaoService.create(dto);
    }
  
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: NotificacaoDto) {
      return this.notificacaoService.update({ id, ...dto });
    }

    @Put(':id/marcar-como-lida')
    updateRead(@Param('id') id: string, @Body() updateDto: NotificacaoDto){
      return this.notificacaoService.marcarComoLida(id, updateDto);
    }

  }
  