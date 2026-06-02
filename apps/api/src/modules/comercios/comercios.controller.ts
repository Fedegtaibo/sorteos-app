import { Controller, Get, Patch, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ComerciosService } from './comercios.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Comercios')
@Controller()
@ApiBearerAuth()
export class ComerciosController {
  constructor(private readonly comerciosService: ComerciosService) {}

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
}
