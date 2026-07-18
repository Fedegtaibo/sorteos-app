import {
  Equals,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({ example: 'MiPassword123!' })
  @IsString()
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  @MaxLength(72, {
    message: 'La contraseña es demasiado larga',
  })
  password: string;

  @ApiProperty({ enum: ['comercio', 'participante'] })
  @IsEnum(['comercio', 'participante'], {
    message: 'El rol debe ser "comercio" o "participante"',
  })
  role: 'comercio' | 'participante';

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(120)
  nombre: string;

  @ApiProperty({ example: 'Pérez', required: false })
  @ValidateIf((o) => o.role === 'participante')
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(120)
  apellido?: string;

  @ApiProperty({ example: '+54 9 341 1234567' })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono celular es obligatorio' })
  @MaxLength(30)
  telefono: string;

  @ApiProperty({ example: '1990-05-20', required: false })
  @ValidateIf((o) => o.role === 'participante')
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento no es válida' },
  )
  fechaNacimiento?: string;

  @ApiProperty({ example: '30123456', required: false })
  @ValidateIf((o) => o.role === 'participante')
  @IsString()
  @Matches(/^\d{7,9}$/, {
    message: 'El DNI debe contener entre 7 y 9 números',
  })
  dni?: string;

  @ApiProperty({ example: 'Argentina', required: false })
  @ValidateIf((o) => o.role === 'participante')
  @IsString()
  @IsNotEmpty({ message: 'La nacionalidad es obligatoria' })
  @MaxLength(80)
  nacionalidad?: string;

  @ApiProperty({ example: 'Entre Ríos', required: false })
  @ValidateIf((o) => o.role === 'participante')
  @IsString()
  @IsNotEmpty({ message: 'La provincia es obligatoria' })
  @MaxLength(120)
  provincia?: string;

  @ApiProperty({ example: 'Paraná', required: false })
  @ValidateIf((o) => o.role === 'participante')
  @IsString()
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  @MaxLength(120)
  ciudad?: string;

  @ApiProperty({
    example: 'Urquiza 1234, piso 2, departamento A',
    required: false,
  })
  @ValidateIf((o) => o.role === 'participante')
  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @MaxLength(255)
  direccion?: string;

  @ApiProperty({ example: '3100', required: false })
  @ValidateIf((o) => o.role === 'participante')
  @IsString()
  @IsNotEmpty({ message: 'El código postal es obligatorio' })
  @MaxLength(20)
  codigoPostal?: string;

  @ApiProperty({ example: true, required: false })
  @ValidateIf((o) => o.role === 'participante')
  @IsBoolean()
  @Equals(true, {
    message: 'Debés declarar que sos mayor de 18 años',
  })
  mayor18Declarado?: boolean;

  @ApiProperty({ example: true, required: false })
  @ValidateIf((o) => o.role === 'participante')
  @IsBoolean()
  @Equals(true, {
    message: 'Debés aceptar los términos y la política de privacidad',
  })
  terminosAceptados?: boolean;
}