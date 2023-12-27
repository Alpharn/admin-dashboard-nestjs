import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from 'src/users/schemas/user.schema';
import { Post } from 'src/posts/schemas/posts.schema';

export type ContentDocument = HydratedDocument<Content>;

@Schema()
export class Content {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  awsKey: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Parent' })
  parent: Post | User;
}

export const ContentSchema = SchemaFactory.createForClass(Content);