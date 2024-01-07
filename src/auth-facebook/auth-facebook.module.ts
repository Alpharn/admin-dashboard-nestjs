import { Module } from '@nestjs/common';

import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [], 
  providers: [FacebookStrategy],
})
export class FacebookAuthModule {}