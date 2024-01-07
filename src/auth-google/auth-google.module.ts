import { Module } from '@nestjs/common';

import { GoogleStrategy } from './strategies/google.strategy';

@Module({})
export class AuthGoogleModule {
  providers: [GoogleStrategy]
}
