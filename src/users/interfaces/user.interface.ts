import { Content } from 'src/content/schema/content.schema';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  roleId: string;
  email: string;
  password: string;
  avatar: Content;
}