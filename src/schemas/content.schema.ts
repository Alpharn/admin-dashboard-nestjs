import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { User } from './user.schema';
import { Post } from './posts.schema';

@Schema()
export class Content {
  @Prop({ required: true })
  url: string; 

  @Prop()
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Parent' })
  parent: Post | User;
}

export const ContentSchema = SchemaFactory.createForClass(Content);