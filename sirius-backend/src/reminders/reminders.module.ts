import { Module } from '@nestjs/common';
import { LessonStartReminderConsumer } from './lesson-start-reminder.consumer';
import { NotificationsModule } from '../notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from '../lessons/entities/lesson.entity';
import { LessonEndReminderConsumer } from './lesson-end-reminder.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), NotificationsModule],
  providers: [LessonStartReminderConsumer, LessonEndReminderConsumer],
})
export class RemindersModule {}
