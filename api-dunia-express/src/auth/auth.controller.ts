import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private getCookieOptions(): CookieOptions {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  async register(
    @Body() dto: RegisterDto,
    @Ip() ip: string,
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'];
    return this.authService.register(dto, {
      ipAddress: ip,
      userAgent,
    });
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and receive token pair' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful. Refresh token returned as HttpOnly cookie.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials or inactive user account',
  })
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent'];

    const result = await this.authService.login(dto, {
      ipAddress: ip,
      userAgent,
    });

    // Set Refresh Token strictly in HttpOnly cookie
    res.cookie('refreshToken', result.refresh_token, this.getCookieOptions());
    res.cookie('accessToken', result.access_token, this.getCookieOptions());

    // Do NOT return refresh token in JSON response body
    return {
      user: result.user,
      access_token: result.access_token,
      token_type: 'Bearer',
      expires_in: 900, // 15 minutes in seconds
    };
  }

  @Public()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiCookieAuth('refreshToken')
  @ApiOperation({
    summary: 'Rotate refresh token and issue a new access token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token rotated successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid, expired, or reused refresh token',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const rawRefreshToken = req.cookies?.refreshToken;

    if (!rawRefreshToken) {
      throw new UnauthorizedException('Refresh token cookie is missing');
    }

    const userAgent = req.headers['user-agent'];
    const result = await this.authService.refresh(rawRefreshToken, {
      ipAddress: ip,
      userAgent,
    });

    // Replace refresh token cookie with newly rotated token
    res.cookie('refreshToken', result.refresh_token, this.getCookieOptions());

    return {
      access_token: result.access_token,
      token_type: 'Bearer',
      expires_in: 900,
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiCookieAuth('refreshToken')
  @ApiOperation({ summary: 'Logout and revoke current refresh session' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logged out successfully',
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const rawRefreshToken = req.cookies?.refreshToken;
    const userAgent = req.headers['user-agent'];

    await this.authService.logout(rawRefreshToken, {
      ipAddress: ip,
      userAgent,
    });

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/auth',
    });

    return { message: 'Logged out successfully' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Revoke all active refresh sessions for the current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All sessions revoked successfully',
  })
  async logoutAll(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'];

    await this.authService.logoutAll(userId, {
      ipAddress: ip,
      userAgent,
    });

    // Clear current cookie as well
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/auth',
    });

    return { message: 'All active sessions have been revoked successfully' };
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
  })
  async getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }
}
