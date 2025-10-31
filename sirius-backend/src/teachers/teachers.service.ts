import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity';
import type { RequestUser } from '../auth/intefaces/request-user.interface';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  create(createTeacherDto: CreateTeacherDto) {
    const teacher = this.teacherRepo.create(createTeacherDto);

    return this.teacherRepo.save(teacher);
  }

  async findAll(user: RequestUser) {
    if (user.role === 'student') {
      const result = await this.studentRepo.findOne({
        where: { id: user.id },
        relations: {
          teachers: true,
        },
      });

      return result?.teachers;
    }
    return this.teacherRepo.find();
  }

  findOne(id: string) {
    return this.teacherRepo.findOneBy({ id });
  }

  findAllStudentsOf(id: string) {
    return this.teacherRepo
      .createQueryBuilder()
      .relation(Teacher, 'students')
      .of(id)
      .loadMany<Student>();
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.teacherRepo.preload({
      id,
      ...updateTeacherDto,
    });

    if (!teacher) throw new NotFoundException(`Teacher ${id} not found`);

    return this.teacherRepo.save(teacher);
  }

  remove(id: string) {
    return this.teacherRepo.delete(id);
  }
}
