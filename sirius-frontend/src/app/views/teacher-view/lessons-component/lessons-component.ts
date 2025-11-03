import {Component, computed, inject, linkedSignal, model, OnInit, signal} from '@angular/core';
import {Lesson, LessonService} from '../../../services/lesson.service';
import {httpResource} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {LessonCard} from '../../../components/lesson-card/lesson-card';
import {StudentSelector} from '../../admin-view/lessons-component/student-selector/student-selector';
import {AuthService} from '../../../services/auth.service';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {WebSocketService} from '../../../services/web-socket.service';

@Component({
  selector: 'app-teacher-lessons-component',
  imports: [
    FormsModule,
    LessonCard,
    StudentSelector,
    CdkDrag,
    CdkDropList,
  ],
  templateUrl: './lessons-component.html',
  styleUrl: './lessons-component.scss',
})
export class LessonsComponent implements OnInit {
  private authService = inject(AuthService);
  private lessonService = inject(LessonService);
  private webSocketService = inject(WebSocketService);

  ngOnInit() {
    this.webSocketService.onMany<Lesson>(
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

  teacherId = signal(this.authService.getUserId()!);

  upcomingLessons = computed(() => this.lessons().filter(
    l => l.status === 'accepted' && new Date(l.startTime) > new Date()
  ));
  pendingLessons = computed(() => this.lessons().filter(l => l.status === 'pending'));
  rejectedLessons = computed(() => this.lessons().filter(l => l.status === 'rejected'));
  pastLessons = computed(() => this.lessons().filter(
    l => l.status === 'accepted' && new Date(l.endTime) < new Date()
  ));

  selectedStudentId = signal<string | null>(null);
  selectedDate = model();
  selectedStartTime = model();
  selectedEndTime = model();

  handleSelectStudentId(id: string | undefined) {
    if (id) {
      this.selectedStudentId.set(id);
    } else {
      this.selectedStudentId.set(null);
    }
  }

  async handleCreateLesson() {
    const lesson = await this.lessonService.create({
      teacherId: this.teacherId(),
      studentId: this.selectedStudentId()!,
      startTime: new Date(`${this.selectedDate()} ${this.selectedStartTime()}`),
      endTime: new Date(`${this.selectedDate()} ${this.selectedEndTime()}`),
    });

    this.lessons.update(ls => [lesson, ...ls]);
  }

  async handleAcceptLesson(event: CdkDragDrop<any, any, Lesson>) {
    const { id } = event.item.data;

    this.lessons.update(ls => ls.filter(l => l.id !== id));

    const lesson = await this.lessonService.accept(id);

    this.lessons.update(ls => [lesson, ...ls]);
  }

  async handleRejectLesson(event: CdkDragDrop<any, any, Lesson>) {
    const { id } = event.item.data;

    this.lessons.update(ls => ls.filter(l => l.id !== id));

    const lesson = await this.lessonService.reject(id);

    this.lessons.update(ls => [lesson, ...ls]);
  }

  handleOpenLesson(id: string) {
    window.open(`/lesson/${id}`, '_blank');
  }
}
