import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;
@Schema()
export class Role {

  @Prop({ required: true, unique: true })
  title: string;
  
  @Prop()
  createdBy: string;

  @Prop()
  updatedBy: string;

}

export const RoleSchema = SchemaFactory.createForClass(Role);