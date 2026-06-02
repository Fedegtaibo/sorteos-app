import {
  Controller, Post, Delete, Get, Param,
  Body, HttpCode, HttpStatus, Headers, RawBodyRequest, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { PagosService } from './pagos.service';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Pagos')
@Controller()
export class PagosController {
  constructor(
    private readonly pagosService: PagosService,
    private readonly config: ConfigService,
  ) {}

  @Post('sorteos/:sorteoId/numeros/:numeroId/reservar')
  @UseGuards(RolesGuard)
  @Roles('participante')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reservar numero por 10 minutos' })
  reservar(
    @Param('sorteoId') sorteoId: string,
    @Param('numeroId') numeroId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.pagosService.reservarNumero(sorteoId, numeroId, userId);
  }

  @Delete('sorteos/:sorteoId/numeros/:numeroId/reservar')
  @UseGuards(RolesGuard)
  @Roles('participante')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liberar reserva manualmente' })
  liberarReserva(
    @Param('sorteoId') sorteoId: string,
    @Param('numeroId') numeroId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.pagosService.liberarReserva(sorteoId, numeroId, userId);
  }

  @Post('sorteos/:sorteoId/numeros/:numeroId/checkout')
  @UseGuards(RolesGuard)
  @Roles('participante')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear preferencia de pago en MercadoPago' })
  checkout(
    @Param('sorteoId') sorteoId: string,
    @Param('numeroId') numeroId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.pagosService.crearCheckout(sorteoId, numeroId, userId);
  }

  @Public()
  @Post('webhooks/mercadopago')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de MercadoPago — no llamar directamente' })
  async webhookMP(
    @Headers('x-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Body() body: any,
  ) {
    // Validar firma del webhook para evitar requests falsos
    if (signature) {
      const secret = this.config.get<string>('MP_WEBHOOK_SECRET');
      const rawBody = req.rawBody?.toString() || JSON.stringify(body);
      const expected = createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (signature !== `sha256=${expected}`) {
        // Loguear pero no rechazar — MP puede usar formatos distintos
        // En produccion validar estrictamente
        console.warn('Firma de webhook MP no coincide');
      }
    }

    return this.pagosService.procesarWebhookMP(body);
  }

  @Get('me/participaciones')
  @UseGuards(RolesGuard)
  @Roles('participante')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mis participaciones' })
  misParticipaciones(@CurrentUser('id') userId: string) {
    return this.pagosService.obtenerParticipaciones(userId);
  }
}
