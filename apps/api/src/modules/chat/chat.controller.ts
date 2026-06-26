import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('entrega/:id')
  listarMensajes(
    @Param('id') entregaId: string,
    @Req() req: any,
  ) {
    return this.chatService.listarMensajes(
      entregaId,
      req.user.id,
    );
  }

  @Post('entrega/:id')
  enviarMensaje(
    @Param('id') entregaId: string,
    @Req() req: any,
    @Body() dto: any,
  ) {
    return this.chatService.enviarMensaje(
      entregaId,
      req.user.id,
      dto.mensaje,
    );
  }
}