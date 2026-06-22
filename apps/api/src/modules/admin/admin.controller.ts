import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('estadisticas')
  @ApiOperation({ summary: 'Metricas globales de la plataforma' })
  estadisticas() { return this.adminService.estadisticasGlobales(); }

  @Get('usuarios')
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  usuarios(@Query('role') role?: string, @Query('page') page?: number) {
    return this.adminService.listarUsuarios({ role, page });
  }

  @Post('usuarios/:id/bloquear')
  @ApiOperation({ summary: 'Bloquear usuario' })
  bloquear(@Param('id') id: string) { return this.adminService.bloquearUsuario(id, true); }

  @Post('usuarios/:id/desbloquear')
  @ApiOperation({ summary: 'Desbloquear usuario' })
  desbloquear(@Param('id') id: string) { return this.adminService.bloquearUsuario(id, false); }

  @Get('sorteos')
  @ApiOperation({ summary: 'Todos los sorteos de la plataforma' })
  sorteos(@Query('page') page?: number) { return this.adminService.listaSorteosTodos({ page }); }

@Get('reclamos')
@ApiOperation({ summary: 'Listar reclamos abiertos' })
reclamos() {
  return this.adminService.listarReclamos();
}
@Patch('reclamos/:id/liberar')
@ApiOperation({ summary: 'Liberar fondos y cerrar reclamo' })
liberarReclamo(@Param('id') id: string) {
  return this.adminService.liberarReclamo(id);
}

@Patch('reclamos/:id/revision')
@ApiOperation({ summary: 'Pasar reclamo a revisión' })
ponerEnRevision(@Param('id') id: string) {
  return this.adminService.ponerEnRevision(id);
}

@Patch('reclamos/:id/cerrar')
@ApiOperation({ summary: 'Cerrar reclamo' })
cerrarReclamo(@Param('id') id: string) {
  return this.adminService.cerrarReclamo(id);
}

}
