import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { AssignTeacherDto } from './dto/asssign-teacher.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly repository: Repository<Student>,
  ) {}

  create(createStudentDto: CreateStudentDto) {
    const student = this.repository.create(createStudentDto);

    return this.repository.save(student);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string) {
    return this.repository.findOneBy({ id });
  }

  assignTeacher(studentId: string, assignTeacherDto: AssignTeacherDto) {
    return this.repository
      .createQueryBuilder()
      .relation(Student, 'teachers')
      .of(studentId)
      .add(assignTeacherDto.teacherId);
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.repository.preload({ id, ...updateStudentDto });

    if (!student) throw new NotFoundException(`Student ${id} not found`);

    return this.repository.save(student);
  }

  remove(id: string) {
    return this.repository.delete(id);
  }
}
