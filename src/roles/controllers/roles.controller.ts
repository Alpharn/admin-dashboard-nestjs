import { Body, Controller, Param, Patch, Post, Request, Delete, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { UpdateRoleDto } from 'src/roles/dto/update-role.dto';
import { Role as RoleSchema } from 'src/roles/schemas/role.schema';
import { JwtUserPayload } from 'src/shared/interfaces/shared.interfaces';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('roles')
@UseGuards(AuthGuard)
@Controller('roles')
export class RolesController {

  constructor(private rolesService: RolesService) {}

  @Post('create/role')
  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  async createRole(
    @Body() createRoleDto: CreateRoleDto, 
    @Request() req: Request & { user: JwtUserPayload }): Promise<RoleSchema> {
    const creatorUserId = req.user.userId;
    return this.rolesService.createRole(createRoleDto, creatorUserId);
  }

  @Get('all')
  async getAllRoles(): Promise<RoleSchema[]> {
    return this.rolesService.findAllRoles();
  }

  @Get('role/:id')
  async getRoleById(@Param('id') id: string): Promise<RoleSchema> {
    return this.rolesService.findRoleById(id);
  }

  @Patch('update/role/:id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: Request & { user: JwtUserPayload }
  ): Promise<RoleSchema> {  
    const updaterUsername = req.user.userId;
    return this.rolesService.updateRole(id, updateRoleDto, updaterUsername);
  }

  @Delete('delete-role/:id')
  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  async removeRole(@Param('id') id: string): Promise<void> {
    return this.rolesService.removeRole(id);
  }

}