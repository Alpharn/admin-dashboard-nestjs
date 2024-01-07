import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from 'src/decorators/public.decorator';
import { GoogleService } from '../services/google.service';

@ApiBearerAuth()
@ApiTags('auth/google')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private googleService: GoogleService) { }

  @Public()
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {
    // Passport will automatically redirect the user to the Google login page
  }

  @Public()
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res): Promise<any> {
    const profile = req.user;
    const tokens = await this.googleService.signInWithGoogle(profile);
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    return res.json({ message: 'Google login successful', accessToken: tokens.accessToken });
  }
}
