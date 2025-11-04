import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationsService } from '../notifications/notifications.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Repository } from 'typeorm';

@Processor('lesson-end-reminder', { concurrency: 4 })
export class LessonEndReminderConsumer extends WorkerHost {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepo: Repository<Lesson>,
    private readonly notificationsService: NotificationsService,
  ) {
    super();
  }

  async process(job: Job<{ lessonId: string }>) {
    const { lessonId } = job.data;

    const lesson = await this.lessonsRepo.findOne({
      where: { id: lessonId },
      relations: {
        teacher: true,
        student: true,
      },
    });

    if (!lesson) return;

    this.notificationsService.sendToMany(
      {
        userIds: [lesson.teacherId, lesson.studentId],
      },
      'reminder:lesson-ends',
      lesson,
    );
  }
}
