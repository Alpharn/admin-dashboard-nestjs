import { Content } from 'src/schemas/content.schema';
import { Role } from 'src/roles/interfaces/roles.interface'

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  role: Role;
  email: string;
  password: string;
  avatar: Content;
}