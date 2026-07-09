import { Injectable, MessageEvent, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from './notification.schema';

interface CreateNotificationData {
  user_id: string;
  institute_id: string;
  type: NotificationType;
  title: string;
  message: string;
  schedule_id: string;
}

@Injectable()
export class NotificationsService {
  // Um Subject por usuário com conexão SSE ativa — não persiste entre reconexões,
  // só existe enquanto o usuário tem o EventSource aberto no browser.
  private streams = new Map<string, Subject<MessageEvent>>();

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: CreateNotificationData): Promise<NotificationDocument> {
    const notification = await this.notificationModel.create(data);
    this.streams.get(data.user_id)?.next({ data: notification });
    return notification;
  }

  findAllForUser(userId: string) {
    return this.notificationModel
      .find({ user_id: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markRead(id: string, userId: string): Promise<NotificationDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Notificação não encontrada');
    }
    const notification = await this.notificationModel
      .findOne({ _id: id, user_id: userId })
      .exec();
    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }
    notification.read = true;
    return notification.save();
  }

  markAllRead(userId: string) {
    return this.notificationModel
      .updateMany({ user_id: userId, read: false }, { read: true })
      .exec();
  }

  getStream(userId: string): Observable<MessageEvent> {
    let subject = this.streams.get(userId);
    if (!subject) {
      subject = new Subject<MessageEvent>();
      this.streams.set(userId, subject);
    }
    return subject.asObservable().pipe(
      finalize(() => {
        this.streams.delete(userId);
      }),
    );
  }
}
