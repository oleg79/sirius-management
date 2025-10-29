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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type RequestUser } from '../auth/intefaces/request-user.interface';

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

  @Get()
  findAllForTeacher(@CurrentUser() user: RequestUser) {
    return this.lessonsService.findAllBy(user.id, user.role);
  }
}
