import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { User } from '../users/schemas/user.schema';
import { Post } from './posts.schema';

@Schema()
export class Blog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' })
  posts: Post[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  users: User[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);