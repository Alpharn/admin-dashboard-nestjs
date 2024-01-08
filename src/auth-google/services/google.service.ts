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
  ) {}

  /**
   * Handles the sign-in process for Google authenticated users.
   * This method checks if a user with the given Google ID exists in the database.
   * If not, it creates a new user with the provided Google profile information.
   *
   * @param profile The Google user profile data received from the authentication process.
   * 
   * @returns A Promise that resolves to the authentication tokens (access and refresh tokens).
   * 
   * @throws BadRequestException if the Google ID is not provided in the profile.
   */
  async signInWithGoogle(profile: any): Promise<Tokens> {
    const googleId = profile.id;
    if (!googleId) {
      throw new BadRequestException('Google ID is required');
    }

    let user = await this.usersService.findUserByGoogleId(googleId);
    // If the user does not exist, create a new user with the given Google profile information.
    if (!user) {
      const userRoleId = await this.rolesService.getUserRoleId();

      const createUserDto: CreateUserDto = {
        email: profile.email,
        firstName: profile.givenName || '',
        lastName: profile.familyName || '',
        googleId: googleId, // Store the Google ID
        password: '', // Password is not set as the authentication is done through Google
        roleId: userRoleId
      };
      user = await this.usersService.createUser(createUserDto);
    }
    return this.authService.getTokens(user);
  }
}