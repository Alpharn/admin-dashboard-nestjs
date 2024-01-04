import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { RolesModule } from 'src/roles/roles.module';
import { MailService } from './services/mail.service';

@Module({
  imports: [UsersModule, RolesModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, MailService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService] 
})
export class AuthModule {}