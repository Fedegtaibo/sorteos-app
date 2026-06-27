import { Controller, Get, Patch, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ComerciosService } from './comercios.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';


@ApiTags('Comercios')
@Controller()
@ApiBearerAuth()
export class ComerciosController {
  constructor(private readonly comerciosService: ComerciosService) {}

  @Public()
@Get('comercios/:id/publico')
@ApiOperation({ summary: 'Perfil publico del comercio' })
perfilPublico(@Param('id') id: string) {
  return this.comerciosService.obtenerPerfilPublico(id);
}

  @Get('comercio/perfil')
  @UseGuards(RolesGuard) @Roles('comercio')
  @ApiOperation({ summary: 'Mi perfil de comercio' })
  miPerfil(@CurrentUser('id') userId: string) {
    return this.comerciosService.obtenerMiPerfil(userId);
  }

  @Patch('comercio/perfil')
  @UseGuards(RolesGuard) @Roles('comercio')
  @ApiOperation({ summary: 'Actualizar perfil' })
  actualizarPerfil(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.comerciosService.actualizarPerfil(userId, dto);
  }

  @Get('comercio/estadisticas')
  @UseGuards(RolesGuard) @Roles('comercio')
  @ApiOperation({ summary: 'Estadisticas del comercio' })
  estadisticas(@CurrentUser('id') userId: string) {
    return this.comerciosService.obtenerEstadisticas(userId);
  }
  @Get('comercio/entregas')
  @UseGuards(RolesGuard)
  @Roles('comercio')
  @ApiOperation({ summary: 'Listar entregas de premios del comercio' })
  listarEntregas(@CurrentUser('id') userId: string) {
    return this.comerciosService.listarEntregas(userId);
  }

  @Patch('comercio/entregas/:id')
  @UseGuards(RolesGuard)
  @Roles('comercio')
  @ApiOperation({ summary: 'Actualizar estado de entrega de premio' })
  actualizarEntrega(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.comerciosService.actualizarEntrega(userId, id, dto);
  }
  // ─── ADMIN ────────────────────────────────────────────────

  @Get('admin/comercios')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiOperation({ summary: '[Admin] Listar todos los comercios' })
  listarTodos(
    @Query('estado') estado?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.comerciosService.listarTodos({ estado, page, limit });
  }

  @Post('admin/comercios/:id/aprobar')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiOperation({ summary: '[Admin] Aprobar comercio' })
  aprobar(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    return this.comerciosService.aprobar(id, adminId);
  }

  @Post('admin/comercios/:id/rechazar')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiOperation({ summary: '[Admin] Rechazar comercio' })
  rechazar(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('motivo') motivo: string,
  ) {
    return this.comerciosService.rechazar(id, adminId, motivo);
  }

  @Post('admin/comercios/:id/suspender')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiOperation({ summary: '[Admin] Suspender comercio y cancelar sorteos activos' })
  suspender(@Param('id') id: string) {
    return this.comerciosService.suspender(id);
  }

  @Patch('admin/comercios/:id/comision')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiOperation({ summary: '[Admin] Actualizar comision del comercio' })
  actualizarComision(@Param('id') id: string, @Body('comisionPct') pct: number) {
    return this.comerciosService.actualizarComision(id, pct);
  }
  @Patch('admin/comercios/:id/mercadopago-token')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '[Admin] Actualizar token Mercado Pago del comercio' })
  actualizarMercadoPagoToken(
    @Param('id') id: string,
    @Body('accessToken') accessToken: string,
  ) {
    return this.comerciosService.actualizarMercadoPagoToken(id, accessToken);
  }
}
