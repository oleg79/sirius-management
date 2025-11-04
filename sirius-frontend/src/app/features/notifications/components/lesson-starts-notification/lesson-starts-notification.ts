import {Component, input, output} from '@angular/core';
import {Lesson} from '../../../../services/lesson.service';
import {InstrumentEmojiPipe} from '../../../../pipes/instrument-emoji-pipe';

@Component({
  selector: 'app-lesson-starts-notification',
  imports: [
    InstrumentEmojiPipe
  ],
  templateUrl: './lesson-starts-notification.html',
  styleUrl: './lesson-starts-notification.scss',
})
export class LessonStartsNotification {
  role = input.required<'teacher' | 'student' | 'admin'>();
  lesson = input.required<Lesson>();

  openLesson = output();

  handleOpenLesson() {
    window.open(`/lesson/${this.lesson().id}`, '_blank');
    this.openLesson.emit();
  }
}
