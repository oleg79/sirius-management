import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

export type CreateStudentDto = {
  firstName: string;
  lastName: string;
  password: string;
  instrument: string;
};

export type AssignTeacherDto = {
  teacherId: string;
  assign: boolean;
}

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  instrument: string;
  createAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);

  private create$(createStudentDto: CreateStudentDto) {
    return this.http.post<Student>('students', createStudentDto)
  }

  create(createStudentDto: CreateStudentDto) {
    return firstValueFrom(this.create$(createStudentDto));
  }

  private delete$(id: string) {
    return this.http.delete(`students/${id}`);
  }

  delete(id: string) {
    return firstValueFrom(this.delete$(id));
  }

  private assign$(id: string, assignTeacherDto: AssignTeacherDto) {
    return this.http.post(`students/${id}/assign-teacher`, assignTeacherDto);
  }

  assign(id: string, assignTeacherDto: AssignTeacherDto) {
    return firstValueFrom(this.assign$(id, assignTeacherDto));
  }
}
