import { Body, Controller, Post, Req, Res, Param, Patch, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from '../services/auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  async signIn(@Res() response: Response, @Body() loginDto: LoginDto): Promise<Response> {
    const tokens = await this.authService.signIn(loginDto);

    response.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    response.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });

    return response.json({ message: 'Login successful', accessToken: tokens.accessToken });
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res() response: Response, @Req() req: Request): Response {
    const userId = req.body.userId;
    this.authService.logout(userId, response);

    return response.json({ message: 'Logout successful' });
  }

  @Patch('reset-password/:id')
  async resetPassword(
    @Param('id') userId: string,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    return this.authService.resetPassword(userId, currentPassword, newPassword);
  }

  @Patch('refresh-token/:id')
  async refreshTokens(
    @Res() response: Response,
    @Param('id') userId: string,
    @Body('refreshToken') refreshToken: string
  ): Promise<Response> {
    const { tokens } = await this.authService.refreshTokens(userId, refreshToken, response);
    return response.json(tokens);
  }

}