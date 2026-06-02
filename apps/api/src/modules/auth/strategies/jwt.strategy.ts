import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { Inject } from '@nestjs/common';

export interface JwtPayload {
  sub: string;       // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @Inject('KNEX') private readonly db: Knex,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.db('users')
      .where({ id: payload.sub })
      .first('id', 'email', 'role', 'is_blocked', 'email_verified');

    if (!user) throw new UnauthorizedException('Token invalido');
    if (user.is_blocked) throw new UnauthorizedException('Cuenta bloqueada');

    return user; // Se adjunta como req.user
  }
}
