import {
  Injectable, ConflictException, UnauthorizedException,
  BadRequestException, Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('KNEX') private readonly db: Knex,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const telefono = dto.telefono.trim();

    let fechaNacimiento: Date | null = null;
    let dniLimpio: string | null = null;

    if (dto.role === 'participante') {
      if (
        !dto.apellido ||
        !dto.fechaNacimiento ||
        !dto.dni ||
        !dto.nacionalidad ||
        !dto.provincia ||
        !dto.ciudad ||
        !dto.direccion ||
        !dto.codigoPostal ||
        dto.mayor18Declarado !== true ||
        dto.terminosAceptados !== true
      ) {
        throw new BadRequestException({
          code: 'DATOS_PARTICIPANTE_INCOMPLETOS',
          message: 'Complet\u00e1 todos los datos personales y de entrega.',
        });
      }

      fechaNacimiento = new Date(`${dto.fechaNacimiento}T00:00:00.000Z`);

      if (Number.isNaN(fechaNacimiento.getTime())) {
        throw new BadRequestException({
          code: 'FECHA_NACIMIENTO_INVALIDA',
          message: 'La fecha de nacimiento no es v\u00e1lida.',
        });
      }

      const hoy = new Date();
      let edad = hoy.getUTCFullYear() - fechaNacimiento.getUTCFullYear();
      const diferenciaMes = hoy.getUTCMonth() - fechaNacimiento.getUTCMonth();

      if (
        diferenciaMes < 0 ||
        (diferenciaMes === 0 &&
          hoy.getUTCDate() < fechaNacimiento.getUTCDate())
      ) {
        edad -= 1;
      }

      if (edad < 18) {
        throw new BadRequestException({
          code: 'EDAD_MINIMA',
          message: 'Para registrarte como participante deb\u00e9s tener 18 a\u00f1os o m\u00e1s.',
        });
      }

      dniLimpio = dto.dni.trim();
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const emailVerificationToken = randomBytes(32).toString('hex');

    let user: any;

    try {
      user = await this.db.transaction(async (trx) => {
        const existing = await trx('users').where({ email }).first('id');

        if (existing) {
          throw new ConflictException({
            code: 'EMAIL_EN_USO',
            message: 'Ya existe una cuenta con ese email',
          });
        }

        if (dto.role === 'participante' && dniLimpio) {
          const existingDni = await trx('perfiles_participantes')
            .where({ dni: dniLimpio })
            .first('id');

          if (existingDni) {
            throw new ConflictException({
              code: 'DNI_EN_USO',
              message: 'Ya existe una cuenta asociada a ese DNI',
            });
          }
        }

        const [createdUser] = await trx('users')
          .insert({
            email,
            password_hash: passwordHash,
            role: dto.role,
            email_verified: false,
            email_verification_token: emailVerificationToken,
            telefono,
          })
          .returning([
            'id',
            'email',
            'role',
            'email_verified',
            'telefono',
            'created_at',
          ]);

        if (dto.role === 'participante' && fechaNacimiento && dniLimpio) {
          await trx('perfiles_participantes').insert({
            user_id: createdUser.id,
            nombre: dto.nombre.trim(),
            apellido: dto.apellido!.trim(),
            fecha_nacimiento: dto.fechaNacimiento,
            dni: dniLimpio,
            nacionalidad: dto.nacionalidad!.trim(),
            provincia: dto.provincia!.trim(),
            ciudad: dto.ciudad!.trim(),
            direccion: dto.direccion!.trim(),
            codigo_postal: dto.codigoPostal!.trim(),
            mayor_18_declarado: true,
            mayor_18_declarado_at: trx.fn.now(),
            terminos_aceptados_at: trx.fn.now(),
          });
        }

        return createdUser;
      });
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error?.code === '23505') {
        const constraint = String(error?.constraint || '');

        if (constraint.includes('dni')) {
          throw new ConflictException({
            code: 'DNI_EN_USO',
            message: 'Ya existe una cuenta asociada a ese DNI',
          });
        }

        throw new ConflictException({
          code: 'EMAIL_EN_USO',
          message: 'Ya existe una cuenta con ese email',
        });
      }

      throw error;
    }

    const tokens = await this.generateTokens(user);
    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    const verificationUrl =
      `${frontendUrl}/verificar-email?token=${emailVerificationToken}`;
    const exposeVerificationUrl =
      this.config.get<string>('EXPOSE_VERIFICATION_URL') === 'true';

    await this.emailService.enviarVerificacionEmail({
      to: user.email,
      verificationUrl,
      nombre: dto.nombre.trim(),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        telefono: user.telefono,
      },
      ...tokens,
      emailVerificationRequired: true,
      ...(exposeVerificationUrl ? { verificationUrl } : {}),
      mensaje:
        dto.role === 'comercio'
          ? 'Cuenta creada. Complet\u00e1 tu perfil de comercio para solicitar aprobaci\u00f3n y verific\u00e1 tu email.'
          : 'Cuenta creada exitosamente. Verific\u00e1 tu email para aumentar la seguridad de tu cuenta.',
    };
  }

  async googleLogin(dto: GoogleAuthDto, internalSecret: string) {
    const expectedSecret = this.config.get<string>('INTERNAL_AUTH_SECRET');

    if (!expectedSecret || internalSecret !== expectedSecret) {
      throw new UnauthorizedException({
        code: 'GOOGLE_AUTH_NO_AUTORIZADO',
        message: 'Autenticacion interna no autorizada',
      });
    }

    const email = dto.email.trim().toLowerCase();

    let user = await this.db('users')
      .where({ email })
      .first();

    if (user?.is_blocked) {
      throw new UnauthorizedException({
        code: 'CUENTA_BLOQUEADA',
        message: 'Tu cuenta fue bloqueada. Contacta con soporte.',
      });
    }

    if (!user) {
      throw new BadRequestException({
        code: 'REGISTRO_COMPLETO_REQUERIDO',
        message:
          'Para crear una cuenta nueva completÃ¡ el formulario de registro con tus datos personales.',
      });
    }

    if (!user.email_verified) {
      [user] = await this.db('users')
        .where({ id: user.id })
        .update({
          email_verified: true,
          email_verification_token: null,
        })
        .returning(['id', 'email', 'role', 'email_verified', 'telefono', 'created_at']);
    }

    const tokens = await this.generateTokens(user);

    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.db('users').where({ id: user.id }).update({ refresh_token_hash: refreshHash });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        email_verified: user.email_verified,
        telefono: user.telefono,
      },
      ...tokens,
    };
  }

  async verifyEmail(token: string) {
    if (!token || typeof token !== 'string') {
      throw new BadRequestException({
        code: 'TOKEN_REQUERIDO',
        message: 'Token de verificacion requerido',
      });
    }

    const user = await this.db('users')
      .where({ email_verification_token: token })
      .first('id', 'email', 'role', 'email_verified');

    if (!user) {
      throw new BadRequestException({
        code: 'TOKEN_INVALIDO',
        message: 'El enlace de verificacion no es valido o ya fue utilizado',
      });
    }

    if (user.email_verified) {
      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          email_verified: true,
        },
        mensaje: 'El email ya estaba verificado',
      };
    }

    const [updated] = await this.db('users')
      .where({ id: user.id })
      .update({
        email_verified: true,
        email_verification_token: null,
      })
      .returning(['id', 'email', 'role', 'email_verified']);

    return {
      user: updated,
      mensaje: 'Email verificado correctamente',
    };
  }

  async resendVerificationEmail(userId: string) {
    const user = await this.db('users')
      .where({ id: userId })
      .first('id', 'email', 'role', 'email_verified');

    if (!user) {
      throw new BadRequestException({
        code: 'USUARIO_NO_ENCONTRADO',
        message: 'Usuario no encontrado',
      });
    }

    if (user.email_verified) {
      return {
        emailVerificationRequired: false,
        mensaje: 'Tu email ya está verificado.',
      };
    }

    const emailVerificationToken = randomBytes(32).toString('hex');

    await this.db('users')
      .where({ id: user.id })
      .update({
        email_verification_token: emailVerificationToken,
      });

    const frontendUrl = this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verificar-email?token=${emailVerificationToken}`;
    const exposeVerificationUrl = this.config.get<string>('EXPOSE_VERIFICATION_URL') === 'true';

    const emailResult = await this.emailService.enviarVerificacionEmail({
      to: user.email,
      verificationUrl,
      nombre: user.email,
    });

    if ((emailResult as any)?.skipped) {
      throw new BadRequestException({
        code: (emailResult as any)?.reason || 'EMAIL_NO_ENVIADO',
        message: 'No pudimos reenviar el email de verificación. Intentá nuevamente más tarde.',
      });
    }

    return {
      emailVerificationRequired: true,
      ...(exposeVerificationUrl ? { verificationUrl } : {}),
      mensaje: 'Te enviamos un nuevo email de verificación.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.db('users')
      .where({ email: dto.email })
      .first();

    if (!user) {
      // Mismo mensaje para no revelar si el email existe
      throw new UnauthorizedException({
        code: 'CREDENCIALES_INVALIDAS',
        message: 'Email o contraseña incorrectos',
      });
    }

    if (user.is_blocked) {
      throw new UnauthorizedException({
        code: 'CUENTA_BLOQUEADA',
        message: 'Tu cuenta fue bloqueada. Contacta con soporte.',
      });
    }

    const passwordOk = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordOk) {
      throw new UnauthorizedException({
        code: 'CREDENCIALES_INVALIDAS',
        message: 'Email o contraseña incorrectos',
      });
    }

    const tokens = await this.generateTokens(user);

    // Guardar hash del refresh token para invalidacion
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.db('users').where({ id: user.id }).update({ refresh_token_hash: refreshHash });

    return {
      user: { id: user.id, email: user.email, role: user.role, email_verified: user.email_verified },
      ...tokens,
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.db('users')
      .where({ id: userId })
      .first(['id', 'email', 'role', 'is_blocked', 'refresh_token_hash']);

    if (!user || user.is_blocked || !user.refresh_token_hash) {
      throw new UnauthorizedException();
    }

    const tokenOk = await bcrypt.compare(refreshToken, user.refresh_token_hash);
    if (!tokenOk) throw new UnauthorizedException('Refresh token invalido');

    const tokens = await this.generateTokens(user);

    // Rotar el refresh token (cada uso genera uno nuevo)
    const newHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.db('users').where({ id: user.id }).update({ refresh_token_hash: newHash });

    return tokens;
  }

  async logout(userId: string) {
    // Invalidar el refresh token borrando el hash
    await this.db('users').where({ id: userId }).update({ refresh_token_hash: null });
    return { mensaje: 'Sesion cerrada correctamente' };
  }

  private async generateTokens(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
