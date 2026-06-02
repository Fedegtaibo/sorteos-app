import {
  Injectable, ConflictException, UnauthorizedException,
  BadRequestException, Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('KNEX') private readonly db: Knex,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Verificar que el email no exista
    const existing = await this.db('users').where({ email: dto.email }).first();
    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_EN_USO',
        message: 'Ya existe una cuenta con ese email',
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const [user] = await this.db('users')
      .insert({
        email: dto.email,
        password_hash: passwordHash,
        role: dto.role,
        email_verified: false,
      })
      .returning(['id', 'email', 'role', 'email_verified', 'created_at']);

    // Si es comercio, crear perfil de comercio en estado pendiente
    if (dto.role === 'comercio') {
      await this.db('comercios').insert({
        user_id: user.id,
        razon_social: dto.nombre || dto.email,
        cuit: '00000000000', // Lo completara en el onboarding
        estado: 'pendiente',
      });
    }

    // TODO: enviar email de verificacion (sprint 2)

    const tokens = await this.generateTokens(user);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      ...tokens,
      mensaje: dto.role === 'comercio'
        ? 'Cuenta creada. Tu perfil de comercio esta pendiente de aprobacion.'
        : 'Cuenta creada exitosamente.',
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
