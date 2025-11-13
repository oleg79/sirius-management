import {Component, computed, inject, linkedSignal, model, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TeacherSelector} from './teacher-selector/teacher-selector';
import {StudentSelector} from './student-selector/student-selector';
import {Lesson, LessonService} from '../../../services/lesson.service';
import {httpResource} from '@angular/common/http';
import {LessonCard} from '../../../components/lesson-card/lesson-card';
import {NotificationsService} from '../../../features/notifications/services/notifications.service';

@Component({
  selector: 'app-admin-lessons-component',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TeacherSelector,
    StudentSelector,
    LessonCard
  ],
  templateUrl: './lessons-component.html',
  styleUrl: './lessons-component.scss',
})
export class LessonsComponent implements OnInit {
  private lessonService = inject(LessonService);
  private notificationsService = inject(NotificationsService);

  ngOnInit() {
    this.notificationsService.onMany<Lesson>(
      ['lesson:created', 'lesson:accepted', 'lesson:rejected'],
      (lesson) => {
        console.log('LESSON NOTIFICATION');
        this.lessons.update((ls) => [
          ...ls.filter(l => l.id !== lesson.id),
          lesson
        ]);
      }
    );
  }

  private lessonsResource = httpResource<Lesson[]>(() => 'lessons', { defaultValue: [] });

  lessons = linkedSignal(() => this.lessonsResource.value());

  upcomingLessons = computed(() => this.lessons().filter(
    l => l.status === 'accepted' && new Date(l.startTime) > new Date()
  ));
  pendingLessons = computed(() => this.lessons().filter(l => l.status === 'pending'));
  rejectedLessons = computed(() => this.lessons().filter(l => l.status === 'rejected'));
  pastLessons = computed(() => this.lessons().filter(
    l => l.status === 'accepted' && new Date(l.endTime) < new Date()
  ));

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
    const lesson = await this.lessonService.create({
      teacherId: this.selectedTeacherId()!,
      studentId: this.selectedStudentId()!,
      startTime: new Date(`${this.selectedDate()} ${this.selectedStartTime()}`),
      endTime: new Date(`${this.selectedDate()} ${this.selectedEndTime()}`),
    });

    this.lessons.update(ls => [lesson, ...ls]);
  }
}
