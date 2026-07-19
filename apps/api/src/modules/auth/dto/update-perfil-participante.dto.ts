import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePerfilParticipanteDto {
  @ApiPropertyOptional({ example: 'Juan' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede quedar vacío' })
  @MaxLength(120)
  nombre?: string;

  @ApiPropertyOptional({ example: 'Pérez' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El apellido no puede quedar vacío' })
  @MaxLength(120)
  apellido?: string;

  @ApiPropertyOptional({ example: '+54 9 343 1234567' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El teléfono no puede quedar vacío' })
  @MaxLength(30)
  telefono?: string;

  @ApiPropertyOptional({ example: 'Argentina' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La nacionalidad no puede quedar vacía' })
  @MaxLength(80)
  nacionalidad?: string;

  @ApiPropertyOptional({ example: 'Entre Ríos' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La provincia no puede quedar vacía' })
  @MaxLength(120)
  provincia?: string;

  @ApiPropertyOptional({ example: 'Paraná' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La ciudad no puede quedar vacía' })
  @MaxLength(120)
  ciudad?: string;

  @ApiPropertyOptional({
    example: 'Urquiza 1234, piso 2, departamento A',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La dirección no puede quedar vacía' })
  @MaxLength(255)
  direccion?: string;

  @ApiPropertyOptional({ example: '3100' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El código postal no puede quedar vacío' })
  @MaxLength(20)
  codigoPostal?: string;
}