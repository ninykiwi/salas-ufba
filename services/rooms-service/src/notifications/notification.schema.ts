import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationType =
  | 'nova_solicitacao'
  | 'solicitacao_aprovada'
  | 'solicitacao_recusada';

export const NOTIFICATION_TYPES: NotificationType[] = [
  'nova_solicitacao',
  'solicitacao_aprovada',
  'solicitacao_recusada',
];

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  institute_id: string;

  @Prop({ required: true, enum: NOTIFICATION_TYPES })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ required: true })
  schedule_id: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
