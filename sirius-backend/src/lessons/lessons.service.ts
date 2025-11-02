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

    return this.lessonsRepo.findOne({
      where: { id },
      relations: { teacher: role !== 'teacher', student: role !== 'student' },
    });
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

    this.notificationsService.sendTo(
      acceptedLesson.studentId,
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

    this.notificationsService.sendTo(
      rejectedLesson.studentId,
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
        teacher: role !== 'teacher',
        student: role !== 'student',
      },
      order: {
        startTime: 'ASC',
      },
    });
  }
}
