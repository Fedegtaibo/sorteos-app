import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RealizarSorteoDto {
  @ApiProperty({
    example: '23456',
    description: 'Seed externo verificable (ej: numero de loteria nacional del dia)',
  })
  @IsString()
  @MinLength(1)
  seedExterno: string;
}
