import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
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

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  async getTokens(user: UserDocument): Promise<Tokens> {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
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
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, { refreshToken: hashedRefreshToken });
  }

  async signUp(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await this.hashData(createUserDto.password);
    const userDocument = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(userDocument);
    await this.updateRefreshToken(userDocument._id.toString(), tokens.refreshToken);

    return new UserEntity(userDocument.toObject());
  }

  async signIn(loginDto: LoginDto): Promise<Tokens> {
    const userDocument = await this.usersService.findByEmail(loginDto.email);

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
    await this.usersService.update(userId, { refreshToken: null });
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  }

  async resetPassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const userDocument = await this.usersService.findById(userId);
    if (!userDocument) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordIsValid = await bcrypt.compare(currentPassword, userDocument.password);
    if (!passwordIsValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await this.hashData(newPassword);
    await this.usersService.update(userId, { password: hashedPassword });

    const tokens = await this.getTokens(userDocument);
    await this.updateRefreshToken(userDocument._id.toString(), tokens.refreshToken);
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const userDocument = await this.usersService.findById(userId);

    if (!userDocument || !userDocument.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, userDocument.refreshToken);
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const newTokens = await this.getTokens(userDocument);
    await this.updateRefreshToken(userDocument._id.toString(), newTokens.refreshToken);
    return newTokens;
  }

  async validateUser(payload: Payload): Promise<UserDocument | undefined> {
    const user = await this.usersService.findById(payload.userId);
    if (!user) {
      return undefined;
    }
    return user;
  }

}
