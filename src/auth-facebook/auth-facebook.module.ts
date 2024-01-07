import { Module } from '@nestjs/common';

import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  providers: [FacebookStrategy]
})
export class FacebookAuthModule {}