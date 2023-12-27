import { Exclude } from 'class-transformer';

import { Content } from 'src/content/schema/content.schema';

export class UserEntity {
  _id?: string;
  firstName: string;
  lastName: string;
  roleId: string;
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