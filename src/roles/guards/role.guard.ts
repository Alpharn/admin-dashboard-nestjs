import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { JwtService } from '@nestjs/jwt';
import { extractJWT } from 'src/auth/strategies/extract-jwt.function';
import { Role } from '../enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = extractJWT(request);
    if (!token) throw new ForbiddenException('Access Denied');

    const decoded = this.jwtService.verify(token, { ignoreExpiration: false });
    const userRole = decoded.role;
    const hasRole = requiredRoles.some((role) => userRole.includes(role));
    if (!hasRole) throw new ForbiddenException('Access Denied');
    return true;
  }
}
