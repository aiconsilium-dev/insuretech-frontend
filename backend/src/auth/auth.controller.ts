import { Controller, Post, Body, UseGuards, Get, Req, Ip, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@/users/entity/user.entity';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import type { Request } from 'express';
import { TokenDto } from './dto/token.dto';
import { ApiResponseDto } from '@/common/dto/api-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 201, description: 'Login successful, tokens returned.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Req() req: Request
  ): Promise<ApiResponseDto<TokenDto>> {
    const userAgent = req.headers['user-agent'] || '';
    const data = await this.authService.login(dto, ip, userAgent);
    return new ApiResponseDto(true, 'Login successful', data);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 201, description: 'Token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async refresh(
    @CurrentUser() user: User,
    @Req() req: Request,
  ): Promise<ApiResponseDto<TokenDto>> {
    const token = req.get('Authorization');
    if (!token) throw new UnauthorizedException('Authorization header not found');
    const refreshToken = token.replace('Bearer', '').trim();
    const data = await this.authService.refreshToken(user, refreshToken);
    return new ApiResponseDto(true, 'Token refreshed successfully', data);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout — pass the refresh token as Bearer' })
  @ApiResponse({ status: 201, description: 'Logout successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async logout(@Req() req: Request): Promise<ApiResponseDto<null>> {
    const token = req.get('Authorization');
    if (!token) throw new UnauthorizedException('Authorization header not found');
    const refreshToken = token.replace('Bearer', '').trim();
    await this.authService.logout(refreshToken);
    return new ApiResponseDto(true, 'Logout successful');
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async me(@CurrentUser() user: User): Promise<ApiResponseDto<User>> {
    const data = await this.authService.getMe(user);
    return new ApiResponseDto(true, 'User profile retrieved', data);
  }
}
