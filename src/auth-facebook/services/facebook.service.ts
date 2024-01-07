import { Injectable } from '@nestjs/common';

import { Tokens } from 'src/auth/interfaces/auth.interfaces';
import { AuthService } from 'src/auth/services/auth.service';
import { RolesService } from 'src/roles/services/roles.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class FacebookService {

constructor(
  private usersService: UsersService,
  private authService: AuthService,
  private rolesService: RolesService
  ) {}

  async signInWithFacebook(profile: any): Promise<Tokens> {
    let user = await this.usersService.findUserByEmail(profile.email);
  
    if (!user) {
      const userRoleId = await this.rolesService.getUserRoleId();
  
      const createUserDto: CreateUserDto = {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        password: '', 
        age: undefined, 
        roleId: userRoleId, 
      };
      user = await this.usersService.createUser(createUserDto);
    }
  
    const tokens = await this.authService.getTokens(user);
    await this.authService.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    return tokens;
  }
}