import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {Teacher} from './teacher.service';
import {Student} from './student.service';

export type LessonStatus = 'pending' | 'accepted' | 'rejected';

export type CreateLessonDto =  {
  teacherId: string;
  studentId: string;
  startTime: Date;
  endTime: Date;
};

export type Lesson = {
  id: string;
  teacherId: string;
  studentId: string;
  teacher?: Teacher;
  student?: Student;
  status: LessonStatus;
  startTime: Date;
  endTime: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private http = inject(HttpClient);

  private create$(createLessonDto: CreateLessonDto) {
    return this.http.post<Lesson>('lessons/create', createLessonDto)
  }

  create(createLessonDto: CreateLessonDto) {
    return firstValueFrom(this.create$(createLessonDto));
  }
}
