import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { RemoveResult, UpdateUserResult } from 'src/shared/interfaces/shared.interfaces';
import { hashData } from 'src/utils/hash.utils';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const emailExists = await this.userModel.exists({ email: createUserDto.email });
    if (emailExists) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await hashData(createUserDto.password);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    await createdUser.save();

    return createdUser;
  }
  
  async findAllUsers(): Promise<UserEntity[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => new UserEntity(user.toObject()));
  }

  async findUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async userExists(email: string): Promise<boolean> {
    const result = await this.userModel.exists({ email });
    return !!result;
  }

  async removeUser(id: string): Promise<RemoveResult> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
    return { deleted: true };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UpdateUserResult> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return {
      user: new UserEntity(updatedUser.toObject()),
      message: 'User has been successfully updated'
    };
  }

}