import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { UsersService } from 'src/users/services/users.service';

import { jwtConstants } from 'src/utils/constants';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { Tokens, Payload } from '../interfaces/auth.interfaces';
import { hashData } from "src/utils/hash.utils";
import { RolesService } from 'src/roles/services/roles.service';
import { randomBytes } from 'crypto';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
    private mailService: MailService,
    private configService: ConfigService
  ) { }

  async getTokens(user: UserDocument): Promise<Tokens> {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.roleId
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: '60m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await hashData(refreshToken);
    await this.usersService.updateUser(userId, { refreshToken: hashedRefreshToken });
  }

  async signUp(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userExists = await this.usersService.userExists(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    const userRoleId = await this.rolesService.getUserRoleId();
    const user = await this.usersService.createUser({
      ...createUserDto,
      roleId: userRoleId
    });

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return new UserEntity(user.toObject());
  }

  async signIn(loginDto: LoginDto): Promise<Tokens> {
    const userDocument = await this.usersService.findUserByEmail(loginDto.email);
    if (!userDocument) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordIsValid = await bcrypt.compare(loginDto.password, userDocument.password);
    if (!passwordIsValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const tokens = await this.getTokens(userDocument);
    await this.updateRefreshToken(userDocument._id.toString(), tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string, res: Response): Promise<void> {
    await this.usersService.updateUser(userId, { refreshToken: null });
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  }

  async resetPassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const userDocument = await this.usersService.findUserById(userId);
    if (!userDocument) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordIsValid = await bcrypt.compare(currentPassword, userDocument.password);
    if (!passwordIsValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await hashData(newPassword);
    await this.usersService.updateUser(userId, { password: hashedNewPassword });

    const tokens = await this.getTokens(userDocument);
    await this.updateRefreshToken(userDocument._id.toString(), tokens.refreshToken);
  }

  async refreshTokens(userId: string, refreshToken: string, res: Response): Promise<{ tokens: Tokens }> {
    const userDocument = await this.usersService.findUserById(userId);

    if (!userDocument || !userDocument.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, userDocument.refreshToken);
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const newTokens = await this.getTokens(userDocument);
    await this.updateRefreshToken(userDocument._id.toString(), newTokens.refreshToken);

    res.cookie('accessToken', newTokens.accessToken, { httpOnly: true });
    res.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true });

    return { tokens: newTokens };
  }

  async validateUser(payload: Payload): Promise<UserDocument | undefined> {
    const user = await this.usersService.findUserById(payload.userId);
    if (!user) {
      return undefined;
    }
    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = randomBytes(32).toString('hex');
    await this.usersService.saveResetPasswordToken(user._id.toString(), resetToken);
    const resetPasswordUrl = `${this.configService.get('RESET_PASSWORD_FRONTEND_URL')}?token=${resetToken}`;
    await this.mailService.sendPasswordResetMail(email, resetPasswordUrl);
  }

  async setNewPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findUserByResetToken(token);
    if (!user) {
      console.log('Invalid or expired reset token');
      throw new NotFoundException('Invalid or expired reset token');
    }

    const hashedNewPassword = await hashData(newPassword);
    await this.usersService.updateUser(user._id.toString(), {
      password: hashedNewPassword,
      resetPasswordToken: null
    });
  }

}
