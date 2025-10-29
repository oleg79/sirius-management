import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post('create')
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto, 'accepted');
  }

  @Post('request')
  request(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto, 'pending');
  }

  @Patch('accept/:id')
  accept(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.lessonsService.accept(id);
  }

  @Get('for-teacher/:id')
  findAllForTeacher(@Param('id', new ParseUUIDPipe()) teacherId: string) {
    return this.lessonsService.findAllBy({ teacherId });
  }

  @Get('for-student/:id')
  findAllForStudent(@Param('id', new ParseUUIDPipe()) studentId: string) {
    return this.lessonsService.findAllBy({ studentId });
  }
}
