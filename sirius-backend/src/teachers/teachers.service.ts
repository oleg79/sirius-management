import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly repository: Repository<Teacher>,
  ) {}

  create(createTeacherDto: CreateTeacherDto) {
    const teacher = this.repository.create(createTeacherDto);

    return this.repository.save(teacher);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string) {
    return this.repository.findOneBy({ id });
  }

  findAllStudentsOf(id: string) {
    return this.repository
      .createQueryBuilder()
      .relation(Teacher, 'students')
      .of(id)
      .loadMany<Student>();
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.repository.preload({
      id,
      ...updateTeacherDto,
    });

    if (!teacher) throw new NotFoundException(`Teacher ${id} not found`);

    return this.repository.save(teacher);
  }

  remove(id: string) {
    return this.repository.delete(id);
  }
}
