import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MapDocument = Map & Document;

@Schema({ timestamps: true })
export class Map {
  @Prop({ required: true })
  institute_id: string;

  @Prop({ required: true })
  institute_name: string;

  @Prop({ required: true })
  floor: number;

  @Prop({ type: [Object], default: [] })
  shapes: Record<string, any>[];
}

export const MapSchema = SchemaFactory.createForClass(Map);
MapSchema.index({ institute_id: 1, floor: 1 }, { unique: true });
