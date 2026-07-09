import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthDto {
  @ApiProperty({ example: 'usuario@gmail.com' })
  @IsEmail({}, { message: 'El email no es valido' })
  email: string;

  @ApiProperty({ example: 'Juan Perez', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}