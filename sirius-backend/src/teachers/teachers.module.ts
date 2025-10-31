import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { Teacher } from './entities/teacher.entity';
import { Student } from '../students/entities/student.entity';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  imports: [
    TypeOrmModule.forFeature([Teacher]),
    TypeOrmModule.forFeature([Student]),
  ],
})
export class TeachersModule {}
