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
  teacher: Teacher;
  student: Student;
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

  private request$(createLessonDto: CreateLessonDto) {
    return this.http.post<Lesson>('lessons/request', createLessonDto)
  }

  request(createLessonDto: CreateLessonDto) {
    return firstValueFrom(this.request$(createLessonDto));
  }

  private accept$(id: string) {
    return this.http.patch<Lesson>(`lessons/${id}/accept`, {});
  }

  accept(id: string) {
    return firstValueFrom(this.accept$(id));
  }

  private reject$(id: string) {
    return this.http.patch<Lesson>(`lessons/${id}/reject`, {});
  }

  reject(id: string) {
    return firstValueFrom(this.reject$(id));
  }
}
