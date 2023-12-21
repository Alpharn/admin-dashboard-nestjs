import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './services/users.service';
import { UserSchema } from 'src/users/schemas/user.schema';
import { UsersController } from './controllers/users.controller';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    forwardRef(() => RolesModule), 
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]) ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}