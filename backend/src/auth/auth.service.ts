import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import * as bcrypt from 'bcrypt';
import { UserRefreshToken } from './entity/user-refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(UserRefreshToken)
    private readonly refreshTokenRepository: Repository<UserRefreshToken>,
  ) {}

  async login(dto: LoginDto, ipAddress: string, userAgent: string): Promise<TokenDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User is not active');
    }

    await this.updateLastLogin(user.id);
    return this.generateTokens(user, ipAddress, userAgent);
  }

  async refreshToken(user: User, refreshToken: string): Promise<TokenDto> {
    const tokenRecord = await this.refreshTokenRepository.findOne({
        where: { userId: user.id, refreshToken },
    });

    if (!tokenRecord) {
        throw new ForbiddenException('Access Denied');
    }
    const accessToken = this.generateAccessToken(user);
    return new TokenDto(accessToken, refreshToken);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenRecord = await this.refreshTokenRepository.findOne({ where: { refreshToken } });
    if (tokenRecord) {
        await this.refreshTokenRepository.softDelete(tokenRecord.id);
    }
  }

  async getMe(user: User): Promise<User> {
      const me = await this.usersService.findById(user.id);
      if (!me) throw new NotFoundException('User not found');
      return me;
  }

  private async generateTokens(user: User, ipAddress: string, userAgent: string): Promise<TokenDto> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateAndSaveRefreshToken(user, ipAddress, userAgent);
    return new TokenDto(accessToken, refreshToken);
  }

  private generateAccessToken(user: User): string {
    const payload = { sub: user.id, email: user.email };
    const expiresIn = this.parseExpiry(this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'));
    return this.jwtService.sign(payload, { expiresIn });
  }

  private async generateAndSaveRefreshToken(user: User, ipAddress: string, userAgent: string): Promise<string> {
    const payload = { sub: user.id };
    const expiresInString = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const expiresInSeconds = this.parseExpiry(expiresInString);
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: expiresInSeconds,
    });

    const tokenRecord = this.refreshTokenRepository.create({
      userId: user.id,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt,
    });

    await this.refreshTokenRepository.save(tokenRecord);
    return refreshToken;
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await this.refreshTokenRepository.query(
      `UPDATE users SET last_login_at = $1 WHERE id = $2`,
      [new Date(), userId],
    );
  }

  private parseExpiry(expiryString: string): number {
    if (!expiryString) return 0;
    const unit = expiryString.slice(-1);
    const value = parseInt(expiryString.slice(0, -1));
    if (isNaN(value)) return 0;

    switch(unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 60 * 60;
        case 'd': return value * 24 * 60 * 60;
        default: return 0;
    }
  }
}
