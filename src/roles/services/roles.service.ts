import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) { }

  async initRoles(): Promise<void> {
    const roles = await this.roleModel.find();
    if (roles.length === 0) {
      await new this.roleModel({ title: 'Admin', createdBy: 'system' }).save();
      await new this.roleModel({ title: 'User', createdBy: 'system' }).save();
    }
  }

  async createRole(createRoleDto: CreateRoleDto, creatorUsername: string): Promise<Role> {
    const existingRole = await this.roleModel.findOne({ title: createRoleDto.title }).exec();
    if (existingRole) {
      throw new BadRequestException(`Role ${createRoleDto.title} already exists.`);
    }
  
    const newRole = new this.roleModel({
      ...createRoleDto,
      createdBy: creatorUsername,
    });
    return newRole.save();
  }

  async findAllRoles(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async findRoleById(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto, updaterUsername: string): Promise<Role> {
    const updatedRole = await this.roleModel.findByIdAndUpdate(id, {
      ...updateRoleDto,
      updatedBy: updaterUsername,
    }, { new: true }).exec();

    if (!updatedRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return updatedRole;
  }

  async removeRole(id: string): Promise<void> {
    const result = await this.roleModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }
}