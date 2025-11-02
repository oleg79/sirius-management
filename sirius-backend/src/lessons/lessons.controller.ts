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
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles(['admin', 'teacher'])
  @Post('create')
  create(
    @CurrentUser() user: RequestUser,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.lessonsService.create(createLessonDto, 'accepted', user.role);
  }

  @Roles(['student'])
  @Post('request')
  request(
    @CurrentUser() user: RequestUser,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.lessonsService.create(createLessonDto, 'pending', user.role);
  }

  @Roles(['teacher'])
  @Patch(':id/accept')
  accept(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.lessonsService.accept(id);
  }

  @Roles(['teacher'])
  @Patch(':id/reject')
  reject(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.lessonsService.reject(id);
  }

  @Get()
  findAllForTeacher(@CurrentUser() user: RequestUser) {
    return this.lessonsService.findAllBy(user.id, user.role);
  }
}
