import { Exclude } from 'class-transformer';

import { Roles } from 'src/roles/schemas/roles.schema';
import { Content } from 'src/schemas/content.schema';

export class UserEntity {
  _id?: string;
  firstName: string;
  lastName: string;
  role: Roles;
  age: number;
  avatar: Content;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}