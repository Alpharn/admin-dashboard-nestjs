import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from 'src/decorators/public.decorator';
import { GoogleService } from '../services/google.service';

@ApiBearerAuth()
@ApiTags('auth/google')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private googleService: GoogleService) {}
  /**
   * Initiates the Google authentication process.
   * The route is guarded by 'google' Passport strategy which automatically redirects to Google login page.
   */
  @Public()
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {}

  /**
   * Handles the redirection after Google authentication.
   * If authentication is successful, user profile is obtained and used to generate access and refresh tokens.
   *
   * @param req The incoming request containing user's profile data.
   * 
   * @param res The response object.
   * 
   * @returns A response with both access and refresh token information.
   */
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

  /**
   * Handles Google sign-in data sent directly from the frontend.
   * This method can be used for manual handling of Google user data without using the Passport strategy.
   *
   * @param googleUserData The Google user data received from the frontend.
   * 
   * @returns An object containing user details and tokens.
   */
  @Public()
  @Post('sign-in')
  async handleGoogleSignIn(@Body() googleUserData: any) {
    return this.googleService.signInWithGoogle(googleUserData);
  }
}