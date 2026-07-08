import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomType =
  | 'sala_aula'
  | 'laboratorio'
  | 'auditorio'
  | 'sala_reuniao';
export type RoomStatus = 'ativa' | 'inativa';

export const ROOM_TYPES: RoomType[] = [
  'sala_aula',
  'laboratorio',
  'auditorio',
  'sala_reuniao',
];

export const ROOM_STATUSES: RoomStatus[] = ['ativa', 'inativa'];

export const ROOM_RESOURCES = [
  'Ar Condicionado',
  'Projetor',
  'Quadro Branco',
  'Computadores',
  'Sistema de Áudio',
  'Wi-Fi Dedicado',
] as const;

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  institute_id: string;

  @Prop({ required: true })
  floor: string;

  @Prop({ required: true, enum: ROOM_TYPES })
  type: RoomType;

  @Prop({ required: true, min: 1 })
  capacity: number;

  @Prop({ type: [String], default: [] })
  resources: string[];

  @Prop({ required: true, enum: ROOM_STATUSES, default: 'ativa' })
  status: RoomStatus;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
