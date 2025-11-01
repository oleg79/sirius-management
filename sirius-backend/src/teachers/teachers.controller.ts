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
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/intefaces/request-user.interface';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Roles(['admin'])
  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Roles(['admin', 'student'])
  @Get()
  findAll(
    @CurrentUser() user: RequestUser,
    @Query('instrument') instrument?: string,
  ) {
    return this.teachersService.findAll(user, instrument);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.teachersService.findOne(id);
  }

  @Roles(['admin'])
  @Get(':id/students')
  students(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.teachersService.findAllStudentsOf(id);
  }

  @Roles(['admin'])
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.teachersService.remove(id);
  }
}
