import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { LessonsModule } from './lessons/lessons.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { NotificationsModule } from './notifications/notifications.module';
import { VideoCallsModule } from './video-calls/video-calls.module';
import { BullModule } from '@nestjs/bullmq';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    TeachersModule,
    StudentsModule,
    LessonsModule,
    AuthModule,
    UsersModule,
    AdminsModule,
    NotificationsModule,
    VideoCallsModule,
    RemindersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
