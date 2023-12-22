import { Post as PostEntity } from "src/posts/schemas/posts.schema";
import { UserEntity } from "src/users/entities/user.entity";

export interface UpdateUserResult {
  user: UserEntity;
  message: string;
}

export interface UpdatePostResult {
  post: PostEntity;
  message: string;
}

export interface RemoveResult {
  deleted: boolean;
  message?: string;
}

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: string;
}