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
    private readonly repository: Repository<Lesson>,
  ) {}

  create(createLessonDto: CreateLessonDto, status: LessonStatus) {
    const lesson = this.repository.create({
      ...createLessonDto,
      status,
    });

    return this.repository.save(lesson);
  }

  async accept(id: string) {
    const lesson = await this.repository.preload({ id, status: 'accepted' });

    if (!lesson) throw new NotFoundException(`Lesson ${id} not found`);

    return this.repository.save(lesson);
  }

  findAllBy(userId: string, role: UserRole) {
    const where =
      role === 'teacher' ? { teacherId: userId } : { studentId: userId };

    return this.repository.find({
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
