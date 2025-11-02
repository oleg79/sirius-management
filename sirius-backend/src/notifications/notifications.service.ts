import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly gateway: NotificationsGateway) {}

  sendTo<T>(userId: string, eventName: string, data: T) {
    this.gateway.sendTo<T>(userId, eventName, data);
  }
}
