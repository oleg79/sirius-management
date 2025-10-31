import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AssignTeacherDto } from './dto/asssign-teacher.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/intefaces/request-user.interface';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles(['admin'])
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Roles(['admin', 'teacher'])
  @Get()
  findAll(
    @CurrentUser() user: RequestUser,
    @Query('instrument') instrument?: string,
  ) {
    return this.studentsService.findAll(user, instrument);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.studentsService.findOne(id);
  }

  @Roles(['admin'])
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.studentsService.remove(id);
  }

  @Roles(['admin'])
  @Post(':id/assign-teacher')
  assignTeacher(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() assignTeacherDto: AssignTeacherDto,
  ) {
    return this.studentsService.assignTeacher(id, assignTeacherDto);
  }
}
