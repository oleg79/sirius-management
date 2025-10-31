import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { AssignTeacherDto } from './dto/asssign-teacher.dto';
import type { RequestUser } from '../auth/intefaces/request-user.interface';
import { Teacher } from '../teachers/entities/teacher.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepo.create(createStudentDto);

    return this.studentRepo.save(student);
  }

  async findAll(user: RequestUser, instrument?: string) {
    if (user.role === 'admin') {
      const where = instrument ? { instrument } : {};

      return this.studentRepo.findBy(where);
    }

    if (user.role === 'teacher') {
      const result = await this.teacherRepo.findOne({
        where: { id: user.id },
        relations: {
          students: true,
        },
      });

      return result?.students ?? [];
    }

    return [];
  }

  findOne(id: string) {
    return this.studentRepo.findOneBy({ id });
  }

  assignTeacher(studentId: string, assignTeacherDto: AssignTeacherDto) {
    const builder = this.studentRepo
      .createQueryBuilder()
      .relation(Student, 'teachers')
      .of(studentId);

    if (assignTeacherDto.assign) {
      return builder.add(assignTeacherDto.teacherId);
    } else {
      return builder.remove(assignTeacherDto.teacherId);
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepo.preload({ id, ...updateStudentDto });

    if (!student) throw new NotFoundException(`Student ${id} not found`);

    return this.studentRepo.save(student);
  }

  remove(id: string) {
    return this.studentRepo.delete(id);
  }
}
