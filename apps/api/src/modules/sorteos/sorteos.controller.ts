import {
  Controller, Get, Post, Patch, Body, Param,
  Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SorteosService } from './sorteos.service';
import { CreateSorteoDto } from './dto/create-sorteo.dto';
import { RealizarSorteoDto } from './dto/realizar-sorteo.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Sorteos')
@Controller()
export class SorteosController {
  constructor(private readonly sorteosService: SorteosService) {}

  // ─── PUBLICOS ─────────────────────────────────────────────

  @Public()
  @Get('sorteos')
  @ApiOperation({ summary: 'Listar sorteos activos' })
  @ApiQuery({ name: 'estado', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  listar(
    @Query('estado') estado?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.sorteosService.listar({ estado, page, limit });
  }

  @Public()
  @Get('sorteos/:id')
  @ApiOperation({ summary: 'Detalle publico de un sorteo' })
  obtener(@Param('id') id: string) {
    return this.sorteosService.obtener(id);
  }

  @Public()
  @Get('sorteos/:id/numeros')
  @ApiOperation({ summary: 'Estado de todos los numeros del sorteo' })
  obtenerNumeros(@Param('id') id: string) {
    return this.sorteosService.obtenerNumeros(id);
  }

  @Public()
  @Get('sorteos/:id/verificar')
  @ApiOperation({ summary: 'Datos publicos para verificar el resultado del sorteo' })
  verificar(@Param('id') id: string) {
    return this.sorteosService.verificar(id);
  }

  // ─── COMERCIO ─────────────────────────────────────────────

  @Get('comercio/sorteos')
  @UseGuards(RolesGuard)
  @Roles('comercio')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mis sorteos con estadisticas' })
  async listarDeComercio(@CurrentUser() user: any) {
    const comercio = await this.getComercioId(user.id);
    return this.sorteosService.listarDeComercio(comercio.id);
  }

  @Post('comercio/sorteos')
  @UseGuards(RolesGuard)
  @Roles('comercio')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo sorteo en borrador' })
  async crear(@CurrentUser() user: any, @Body() dto: CreateSorteoDto) {
    const comercio = await this.getComercioId(user.id);
    return this.sorteosService.crear(comercio.id, dto);
  }

  @Post('comercio/sorteos/:id/activar')
  @UseGuards(RolesGuard)
  @Roles('comercio')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar sorteo — genera numeros y chances' })
  async activar(@Param('id') id: string, @CurrentUser() user: any) {
    const comercio = await this.getComercioId(user.id);
    return this.sorteosService.activar(id, comercio.id);
  }

  @Post('comercio/sorteos/:id/sortear')
  @UseGuards(RolesGuard)
  @Roles('comercio')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Realizar el sorteo — selecciona el ganador' })
  async realizar(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: RealizarSorteoDto,
  ) {
    const comercio = await this.getComercioId(user.id);
    return this.sorteosService.realizar(id, comercio.id, dto);
  }

  // Helper: obtener comercio del usuario autenticado
  private async getComercioId(userId: string) {
    const { db } = this.sorteosService as any;
    const comercio = await db('comercios').where({ user_id: userId, estado: 'aprobado' }).first('id');
    if (!comercio) throw new Error('Comercio no aprobado');
    return comercio;
  }
}
