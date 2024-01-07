import { Module } from '@nestjs/common';

import { AppleStrategy } from './strategies/apple.strategy';

@Module({
  providers: [AppleStrategy],
})
export class AppleAuthModule {}