import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Repository } from 'typeorm';
import { Lesson, LessonStatus } from './entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepo: Repository<Lesson>,
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

    return this.lessonsRepo.findOne({
      where: { id },
      relations: { student: true },
    });
  }

  async reject(lessonId: string) {
    const lesson = await this.lessonsRepo.preload({
      id: lessonId,
      status: 'rejected',
    });

    if (!lesson) throw new NotFoundException(`Lesson ${lessonId} not found`);

    const { id } = await this.lessonsRepo.save(lesson);

    return this.lessonsRepo.findOne({
      where: { id },
      relations: { student: true },
    });
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
