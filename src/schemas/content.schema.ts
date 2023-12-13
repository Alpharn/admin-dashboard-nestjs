import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Content {
  @Prop({ required: true })
  url: string; 

  @Prop()
  type: string;
}

export const ContentSchema = SchemaFactory.createForClass(Content);