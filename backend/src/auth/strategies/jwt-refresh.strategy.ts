import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const token = req.get('Authorization');
    if (!token) throw new Error('Authorization header not found');
    const refreshToken = token.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
