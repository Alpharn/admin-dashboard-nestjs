import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PostsModule } from './posts/posts.module';
import { ContentModule } from './content/content.module';
import { AwsModule } from './aws/aws.module';
import { MailService } from './auth/services/mail.service';
import { FacebookAuthModule } from './auth-facebook/auth-facebook.module';
import { FacebookService } from './auth-facebook/services/facebook.service';
import { FacebookAuthController } from './auth-facebook/controllers/facebook-auth.controller';
import { AppleAuthModule } from './auth-apple/auth-apple.module';
import { AppleService } from './auth-apple/services/apple.service';
import { AppleAuthController } from './auth-apple/controllers/apple.controller';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { GoogleAuthController } from './auth-google/controller/google.controller';
import { GoogleService } from './auth-google/services/google.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, 
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    RolesModule,
    PostsModule,
    ContentModule,
    AwsModule,
    FacebookAuthModule,
    AppleAuthModule,
    AuthGoogleModule,
  ],
  controllers: [ AppController, FacebookAuthController, AppleAuthController, GoogleAuthController  ],
  providers: [ AppService, MailService, AppleService, FacebookService, GoogleService ],
})
export class AppModule {}
