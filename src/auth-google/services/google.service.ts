import { Injectable, BadRequestException } from '@nestjs/common';

import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Tokens } from 'src/auth/interfaces/auth.interfaces';
import { RolesService } from 'src/roles/services/roles.service';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class GoogleService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private rolesService: RolesService
  ) { }

  // async signInWithGoogle(profile: any): Promise<Tokens> {
  //   console.log('Google profile:', profile);
  //   const email = profile.email;
  //   if (!email) {
  //     throw new BadRequestException('Email is required');
  //   }
  //   let user = await this.usersService.findUserByEmail(email);

  //   if (!user) {
  //     const userRoleId = await this.rolesService.getUserRoleId();

  //     const createUserDto: CreateUserDto = {
  //       email: email,
  //       firstName: profile.firstName || '',
  //       lastName: profile.lastName || '',
  //       password: '',
  //       age: undefined,
  //       roleId: userRoleId,
  //     };
  //     user = await this.usersService.createUser(createUserDto);
  //   }

  //   return this.authService.getTokens(user);
  // }
  async signInWithGoogle(profile: any): Promise<Tokens> {
    console.log('Google profile:', profile);
    const googleId = profile.id;
    if (!googleId) {
      throw new BadRequestException('Google ID is required');
    }

    let user = await this.usersService.findUserByGoogleId(googleId);

    if (!user) {
      const userRoleId = await this.rolesService.getUserRoleId();

      const createUserDto: CreateUserDto = {
        email: profile.email,
        firstName: profile.givenName || '',
        lastName: profile.familyName || '',
        googleId: googleId,
        password: '',
        roleId: userRoleId
      };
      user = await this.usersService.createUser(createUserDto);
    }
    return this.authService.getTokens(user);
  }
}
