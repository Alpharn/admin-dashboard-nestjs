import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { extractJWT } from '../strategies/extract-jwt.function';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = extractJWT(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    const decoded = this.jwtService.decode(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired authentication token');
    }

    request.user = decoded;
    return true;
  }
}
