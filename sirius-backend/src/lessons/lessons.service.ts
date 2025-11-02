import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Repository } from 'typeorm';
import { Lesson, LessonStatus } from './entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepo: Repository<Lesson>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    createLessonDto: CreateLessonDto,
    status: LessonStatus,
    role: UserRole,
  ) {
    const lesson = this.lessonsRepo.create({
      ...createLessonDto,
      status,
    });

    const { id } = await this.lessonsRepo.save(lesson);

    const createdLesson = await this.lessonsRepo.findOne({
      where: { id },
      relations: { teacher: role !== 'teacher', student: role !== 'student' },
    });

    if (!createdLesson) return;

    const recipients = {};
    if (role === 'admin') {
      recipients['userIds'] = [
        createdLesson.studentId,
        createdLesson.teacherId,
      ];
    } else if (role === 'teacher') {
      recipients['userIds'] = [createdLesson.studentId];
      recipients['channels'] = ['admins'];
    } else if (role === 'student') {
      recipients['userIds'] = [createdLesson.teacherId];
      recipients['channels'] = ['admins'];
    }

    this.notificationsService.sendToMany(
      recipients,
      'lesson:created',
      createdLesson,
    );

    return createdLesson;
  }

  async accept(lessonId: string) {
    const lesson = await this.lessonsRepo.preload({
      id: lessonId,
      status: 'accepted',
    });

    if (!lesson) throw new NotFoundException(`Lesson ${lessonId} not found`);

    const { id } = await this.lessonsRepo.save(lesson);

    const acceptedLesson = await this.lessonsRepo.findOne({
      where: { id },
      relations: { student: true },
    });

    if (!acceptedLesson) return null;

    this.notificationsService.sendToMany(
      {
        userIds: [acceptedLesson.studentId],
        channels: ['admins'],
      },
      'lesson:accepted',
      acceptedLesson,
    );

    return acceptedLesson;
  }

  async reject(lessonId: string) {
    const lesson = await this.lessonsRepo.preload({
      id: lessonId,
      status: 'rejected',
    });

    if (!lesson) throw new NotFoundException(`Lesson ${lessonId} not found`);

    const { id } = await this.lessonsRepo.save(lesson);

    const rejectedLesson = await this.lessonsRepo.findOne({
      where: { id },
      relations: { student: true },
    });

    if (!rejectedLesson) return null;

    this.notificationsService.sendToMany(
      {
        userIds: [rejectedLesson.studentId],
        channels: ['admins'],
      },
      'lesson:rejected',
      rejectedLesson,
    );

    return rejectedLesson;
  }

  findAllBy(userId: string, role: UserRole) {
    const where =
      role === 'teacher'
        ? { teacherId: userId }
        : role === 'student'
          ? { studentId: userId }
          : {};

    return this.lessonsRepo.find({
      where,
      relations: {
        teacher: true,
        student: true,
      },
      order: {
        startTime: 'ASC',
      },
    });
  }
}
