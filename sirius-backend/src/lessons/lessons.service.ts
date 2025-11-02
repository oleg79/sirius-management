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

  async create(createLessonDto: CreateLessonDto, status: LessonStatus) {
    const lesson = this.lessonsRepo.create({
      ...createLessonDto,
      status,
    });

    const { id } = await this.lessonsRepo.save(lesson);

    return this.lessonsRepo.findOne({
      where: { id },
      relations: { teacher: true, student: true },
    });
  }

  async accept(id: string) {
    const lesson = await this.lessonsRepo.preload({ id, status: 'accepted' });

    if (!lesson) throw new NotFoundException(`Lesson ${id} not found`);

    return this.lessonsRepo.save(lesson);
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
