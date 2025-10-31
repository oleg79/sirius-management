import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

export type CreateTeacherDto = {
  firstName: string;
  lastName: string;
  password: string;
  instrument: string;
  experience: number;
};

export type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  instrument: string;
  experience: number;
  createAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private http = inject(HttpClient);

  private create$(createTeacherDto: CreateTeacherDto) {
    return this.http.post<Teacher>('teachers', createTeacherDto)
  }

  create(createTeacherDto: CreateTeacherDto) {
    return firstValueFrom(this.create$(createTeacherDto));
  }

  private delete$(id: string) {
    return this.http.delete(`teachers/${id}`);
  }

  delete(id: string) {
    return firstValueFrom(this.delete$(id));
  }
}
