import {
  IsString, IsDateString, IsNumber, IsInt,
  Min, Max, MaxLength, IsOptional, IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSorteoDto {
  @ApiProperty({ example: 'iPhone 16 Pro Max 256GB' })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: '2025-12-31T20:00:00-03:00' })
  @IsDateString()
  fechaSorteo: string;

  @ApiProperty({ example: 2500, description: 'Valor por numero en ARS' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  valorNumero: number;

  @ApiProperty({ example: 50, description: 'Cantidad de numeros visibles' })
  @IsInt()
  @Min(2)
  @Max(10000)
  @Type(() => Number)
  cantNumeros: number;

  @ApiProperty({ example: 3, description: 'Chances internas por cada numero visible' })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  chancesPorNumero?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imagenPrincipalUrl?: string;
}
