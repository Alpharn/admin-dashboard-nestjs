import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Public } from 'src/decorators/public.decorator';
import { AppleService } from '../services/apple.service';

@ApiBearerAuth()
@ApiTags('auth/apple')
@Controller('auth/apple')
export class AppleAuthController {
  constructor(private appleService: AppleService) {}

  @Public()
  @Get()
  @UseGuards(AuthGuard('apple'))
  async appleLogin(): Promise<void> {}

  @Public()
  @Get('callback')
  @UseGuards(AuthGuard('apple'))
  async appleAuthRedirect(@Req() req, @Res() res: Response): Promise<Response> {
    const profile = req.user;
    const tokens = await this.appleService.signInWithApple(profile);
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    return res.json({ message: 'Apple login successful', accessToken: tokens.accessToken });
  }
}