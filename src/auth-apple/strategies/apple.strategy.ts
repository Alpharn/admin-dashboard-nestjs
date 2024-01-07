import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('APPLE_CLIENT_ID'),
      teamID: configService.get('APPLE_TEAM_ID'),
      keyID: configService.get('APPLE_KEY_ID'),
      privateKey: configService.get('APPLE_PRIVATE_KEY'),
      callbackURL: `${configService.get('API_URL')}auth/apple/callback`,
      scope: ['name', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    const { email, name } = profile;
    const user = {
      email: email,
      firstName: name?.firstName,
      lastName: name?.lastName,
      accessToken
    };
    return user;
  }
}