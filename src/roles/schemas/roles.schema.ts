import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Roles {
  @Prop()
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);