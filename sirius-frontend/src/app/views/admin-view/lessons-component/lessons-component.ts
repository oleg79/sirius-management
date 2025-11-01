import {Component, inject, linkedSignal, model, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TeacherSelector} from './teacher-selector/teacher-selector';
import {StudentSelector} from './student-selector/student-selector';
import {Lesson, LessonService} from '../../../services/lesson.service';
import {httpResource} from '@angular/common/http';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-admin-lessons-component',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TeacherSelector,
    StudentSelector,
    JsonPipe
  ],
  templateUrl: './lessons-component.html',
  styleUrl: './lessons-component.scss',
})
export class LessonsComponent {
  private lessonService = inject(LessonService);

  private lessonsResource = httpResource<Lesson[]>(() => 'lessons', { defaultValue: [] });

  lessons = linkedSignal(() => this.lessonsResource.value());

  selectedTeacherId = signal<string | null>(null);
  selectedStudentId = signal<string | null>(null);
  selectedDate = model();
  selectedStartTime = model();
  selectedEndTime = model();

  handleSelectTeacherId(id: string | undefined) {
    if (id) {
      this.selectedTeacherId.set(id);
    } else {
      this.selectedTeacherId.set(null);
    }
  }

  handleSelectStudentId(id: string | undefined) {
    if (id) {
      this.selectedStudentId.set(id);
    } else {
      this.selectedStudentId.set(null);
    }
  }

  async handleCreateLesson() {
    await this.lessonService.create({
      teacherId: this.selectedTeacherId()!,
      studentId: this.selectedStudentId()!,
      startTime: new Date(`${this.selectedDate()} ${this.selectedStartTime()}`),
      endTime: new Date(`${this.selectedDate()} ${this.selectedEndTime()}`),
    });

    this.lessonsResource.reload();
  }
}
