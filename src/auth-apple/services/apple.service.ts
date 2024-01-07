import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Tokens } from 'src/auth/interfaces/auth.interfaces';
import { RolesService } from 'src/roles/services/roles.service';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class AppleService {

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private rolesService: RolesService,
  ) {}

  async signInWithApple(profile: any): Promise<Tokens> {
    const email = profile.email;
    let user = await this.usersService.findUserByEmail(email);

    if (!user) {
      const userRoleId = await this.rolesService.getUserRoleId();

      const createUserDto: CreateUserDto = {
        email: email,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
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
