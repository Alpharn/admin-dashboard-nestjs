import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './services/users.service';
import { UserSchema } from 'src/users/schemas/user.schema';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [ MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]) ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
