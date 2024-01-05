import { Body, Controller, Post, Req, Res, Param, Patch, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from '../services/auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Public } from 'src/decorators/public.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { SetNewPasswordDto } from '../dto/set-password.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'User Registration' })
  @ApiCreatedResponse({ description: 'User successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('sign-in')
  @ApiOperation({ summary: 'User Login' })
  @ApiOkResponse({ description: 'Successful login' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async signIn(@Res() response: Response, @Body() loginDto: LoginDto): Promise<Response> {
    const tokens = await this.authService.signIn(loginDto);
    response.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    response.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    return response.json({ message: 'Login successful', accessToken: tokens.accessToken });
  }

  @Post('logout')
  @ApiOperation({ summary: 'User Logout' })
  @ApiOkResponse({ description: 'Successful logout' })
  @HttpCode(200)
  logout(@Res() response: Response, @Req() req: Request): Response {
    const userId = req.body.userId;
    this.authService.logout(userId, response);
    return response.json({ message: 'Logout successful' });
  }

  @Patch('change-password/:id')
  @ApiOperation({ summary: 'Password Reset' })
  @ApiOkResponse({ description: 'Password successfully reset' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async changePassword(
    @Param('id') userId: string,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    return this.authService.resetPassword(userId, currentPassword, newPassword);
  }

  @Patch('refresh-token/:id')
  @ApiOperation({ summary: 'Token Refresh' })
  @ApiOkResponse({ description: 'Token successfully refreshed' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async refreshTokens(
    @Res() response: Response,
    @Param('id') userId: string,
    @Body('refreshToken') refreshToken: string
  ): Promise<Response> {
    const { tokens } = await this.authService.refreshTokens(userId, refreshToken, response);
    return response.json(tokens);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiOkResponse({ description: 'Password reset email sent successfully' })
  @ApiBadRequestResponse({ description: 'Invalid email' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Patch('set-new-password')
  @ApiOperation({ summary: 'Set New Password' })
  @ApiOkResponse({ description: 'Password successfully reset' })
  @ApiBadRequestResponse({ description: 'Invalid token or data' })
  async setNewPassword(@Body() setPasswordDto: SetNewPasswordDto): Promise<void> {
    await this.authService.setNewPassword(setPasswordDto.token, setPasswordDto.newPassword);
  }

}