import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService],
  imports: [JwtModule],
})
export class NotificationsModule {}
