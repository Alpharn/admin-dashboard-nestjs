import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Content } from './content.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  age: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Content' })
  avatar: Content;
}
export const UserSchema = SchemaFactory.createForClass(User);