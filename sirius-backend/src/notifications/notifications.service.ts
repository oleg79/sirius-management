import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly gateway: NotificationsGateway) {}

  sendToUser<T>(userId: string, eventName: string, data: T) {
    this.gateway.sendToOne<T>(`user:${userId}`, eventName, data);
  }

  sendToMany<T>(
    recipients: { userIds?: string[]; channels?: string[] },
    eventName: string,
    data: T,
  ) {
    const tos = (recipients.userIds?.map((id) => `user:${id}`) ?? []).concat(
      recipients.channels ?? [],
    );

    if (tos.length === 0) return;

    this.gateway.sendToMany(tos, eventName, data);
  }
}
