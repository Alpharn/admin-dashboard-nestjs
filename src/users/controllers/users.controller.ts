import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../services/users.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { RoleGuard } from 'src/roles/guards/role.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('users')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create/user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('all')
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.updateUser(id, updateUserDto);
    return {
      data: result.user,
      message: result.message
    };
  }

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }

}