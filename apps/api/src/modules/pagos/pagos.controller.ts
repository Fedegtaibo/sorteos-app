import {
  Controller, Post, Delete, Get, Patch, Param,
  Body, HttpCode, HttpStatus, Headers, RawBodyRequest, Req,
  UseGuards,ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';

import { PagosService } from './pagos.service';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { NotificationsService } from '../notifications/notifications.service';

@ApiTags('Pagos')
@Controller()
export class PagosController {
  constructor(
    private readonly pagosService: PagosService,
    private readonly config: ConfigService,
    private readonly notificationsService: NotificationsService,
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
@Post('dev/sorteos/:sorteoId/numeros/:numeroId/simular-pago')
@ApiOperation({ summary: 'DEV: simular pago aprobado' })
simularPagoAprobado(
  @Param('sorteoId') sorteoId: string,
  @Param('numeroId') numeroId: string,
) {
  const nodeEnv = this.config.get<string>('NODE_ENV');

  if (nodeEnv !== 'development') {
    throw new ForbiddenException(
      'El pago simulado solo está disponible en desarrollo',
    );
  }

  return this.pagosService.simularPagoAprobado(
    sorteoId,
    numeroId,
    '05c9d289-2554-44ff-aee3-5ace0c2be37f',
  );
}

  @Post('sorteos/:sorteoId/checkout')
  @UseGuards(RolesGuard)
  @Roles('participante')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear preferencia de pago para varios numeros' })
  checkoutMultiple(
    @Param('sorteoId') sorteoId: string,
    @Body('numeroIds') numeroIds: string[],
    @CurrentUser('id') userId: string,
  ) {
    return this.pagosService.crearCheckoutMultiple(sorteoId, numeroIds, userId);
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
    if (signature) {
      const secret = this.config.get<string>('MP_WEBHOOK_SECRET') || 'dev-secret';
      const rawBody = req.rawBody?.toString() || JSON.stringify(body);
      const expected = createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (signature !== `sha256=${expected}`) {
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

  @Get('me/premios')
  @UseGuards(RolesGuard)
  @Roles('participante')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mis premios ganados' })
  misPremios(@CurrentUser('id') userId: string) {
    return this.pagosService.obtenerMisPremios(userId);
  }

  @Patch('me/premios/:id/confirmar')
  @UseGuards(RolesGuard)
  @Roles('participante')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirmar recepcion del premio' })
  confirmarPremio(
    @CurrentUser('id') userId: string,
    @Param('id') entregaId: string,
  ) {
    return this.pagosService.confirmarRecepcionPremio(userId, entregaId);
  }

  @Patch('me/premios/:id/reclamar')
  @UseGuards(RolesGuard)
  @Roles('participante')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Abrir reclamo por premio no recibido' })
  reclamarPremio(
    @CurrentUser('id') userId: string,
    @Param('id') entregaId: string,
    @Body('motivo') motivo: string,
  ) {
    return this.pagosService.reclamarPremio(userId, entregaId, motivo);
  }

  @Get('me/notificaciones')
  @UseGuards(RolesGuard)
  @Roles('participante', 'comercio', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mis notificaciones' })
  misNotificaciones(@CurrentUser('id') userId: string) {
    return this.notificationsService.obtenerNotificaciones(userId);
  }

  @Patch('me/notificaciones/:id/leida')
  @UseGuards(RolesGuard)
  @Roles('participante', 'comercio', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar notificacion como leida' })
  marcarNotificacionLeida(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.notificationsService.marcarLeida(userId, id);
  }

  @Patch('me/notificaciones/leer-todas')
  @UseGuards(RolesGuard)
  @Roles('participante', 'comercio', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leidas' })
  marcarTodasNotificacionesLeidas(@CurrentUser('id') userId: string) {
    return this.notificationsService.marcarTodasLeidas(userId);
  }
}
