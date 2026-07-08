import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScheduleCategory =
  | 'aula_regular'
  | 'defesa'
  | 'palestra'
  | 'reuniao'
  | 'minicurso';
export type ScheduleRecurrence = 'unico' | 'semanal' | 'quinzenal';
export type ScheduleStatus = 'pendente' | 'confirmado' | 'cancelado';

export const SCHEDULE_CATEGORIES: ScheduleCategory[] = [
  'aula_regular',
  'defesa',
  'palestra',
  'reuniao',
  'minicurso',
];

export const SCHEDULE_RECURRENCES: ScheduleRecurrence[] = [
  'unico',
  'semanal',
  'quinzenal',
];

export const SCHEDULE_STATUSES: ScheduleStatus[] = [
  'pendente',
  'confirmado',
  'cancelado',
];

export type ScheduleDocument = Schedule & Document;

@Schema({ timestamps: true })
export class Schedule {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: SCHEDULE_CATEGORIES })
  category: ScheduleCategory;

  @Prop({ required: true })
  professor_id: string;

  @Prop({ required: true })
  professor_name: string;

  @Prop({ required: true })
  room_id: string;

  @Prop({ required: true })
  institute_id: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  start_time: string;

  @Prop({ required: true })
  end_time: string;

  @Prop({ required: true, min: 1 })
  expected_audience: number;

  @Prop({ required: true, enum: SCHEDULE_RECURRENCES })
  recurrence: ScheduleRecurrence;

  @Prop({ type: [String], default: [] })
  equipment_requested: string[];

  @Prop({ default: '' })
  notes: string;

  @Prop({ required: true, enum: SCHEDULE_STATUSES, default: 'pendente' })
  status: ScheduleStatus;

  @Prop({ required: true })
  created_by: string;

  @Prop()
  recurrence_group_id?: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
