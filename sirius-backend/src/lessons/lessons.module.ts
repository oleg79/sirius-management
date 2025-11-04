import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from './entities/lesson.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService],
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    BullModule.registerQueue(
      { name: 'lesson-start-reminder' },
      { name: 'lesson-end-reminder' },
    ),
    NotificationsModule,
  ],
})
export class LessonsModule {}
