import { UserEntity } from "src/users/entities/user.entity";

export interface UpdateResult {
  user: UserEntity;
  message: string;
}

export interface RemoveResult {
  deleted: boolean;
  message?: string;
}