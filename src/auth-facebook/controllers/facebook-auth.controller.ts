import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Public } from 'src/decorators/public.decorator';
import { FacebookService } from '../services/facebook.service';

@ApiBearerAuth()
@ApiTags('auth/facebook')
@Controller('auth/facebook')
export class FacebookAuthController {
  constructor(private facebookService: FacebookService) {}

  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<void> {
    // Passport will automatically redirect the user to the Facebook login page
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req, @Res() res: Response): Promise<Response> {
    const profile = req.user;
    const tokens = await this.facebookService.signInWithFacebook(profile);
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    return res.json({ message: 'Facebook login successful', accessToken: tokens.accessToken });
  }
}