import { IsEmail, IsEnum, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail({}, { message: 'El email no es valido' })
  email: string;

  @ApiProperty({ example: 'MiPassword123!' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(72, { message: 'La contraseña es demasiado larga' })
  password: string;

  @ApiProperty({ enum: ['comercio', 'participante'] })
  @IsEnum(['comercio', 'participante'], {
    message: 'El rol debe ser "comercio" o "participante"',
  })
  role: 'comercio' | 'participante';

  @ApiProperty({ example: 'Juan Perez', required: false })
  @IsString()
  @MaxLength(255)
  nombre?: string;
}
