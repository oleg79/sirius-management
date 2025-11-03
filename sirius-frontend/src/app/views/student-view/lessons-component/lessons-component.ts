import {Component, computed, inject, linkedSignal, model, OnInit, signal} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {AuthService} from '../../../services/auth.service';
import {Lesson, LessonService} from '../../../services/lesson.service';
import {FormsModule} from '@angular/forms';
import {LessonCard} from '../../../components/lesson-card/lesson-card';
import {TeacherSelector} from '../../admin-view/lessons-component/teacher-selector/teacher-selector';
import {NotificationsService} from '../../../features/notifications/services/notifications.service';

@Component({
  selector: 'app-student-lessons-component',
  imports: [
    FormsModule,
    LessonCard,
    TeacherSelector
  ],
  templateUrl: './lessons-component.html',
  styleUrl: './lessons-component.scss',
})
export class LessonsComponent implements OnInit{
  private authService = inject(AuthService);
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

  studentId = signal(this.authService.getUserId()!);

  upcomingLessons = computed(() => this.lessons().filter(
    l => l.status === 'accepted' && new Date(l.startTime) > new Date()
  ));
  pendingLessons = computed(() => this.lessons().filter(l => l.status === 'pending'));
  rejectedLessons = computed(() => this.lessons().filter(l => l.status === 'rejected'));
  pastLessons = computed(() => this.lessons().filter(
    l => l.status === 'accepted' && new Date(l.endTime) < new Date()
  ));

  selectedTeacherId = signal<string | null>(null);
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

  async handleRequestLesson() {
    const lesson = await this.lessonService.request({
      teacherId: this.selectedTeacherId()!,
      studentId: this.studentId(),
      startTime: new Date(`${this.selectedDate()} ${this.selectedStartTime()}`),
      endTime: new Date(`${this.selectedDate()} ${this.selectedEndTime()}`),
    });

    this.lessons.update(ls => [lesson, ...ls]);
  }
}
