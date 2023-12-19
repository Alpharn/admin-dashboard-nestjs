import { User } from 'src/users/interfaces/user.interface';

export interface Payload {
  userId: string;
  user: User;
  token: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}