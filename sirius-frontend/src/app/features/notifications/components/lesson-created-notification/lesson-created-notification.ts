import { Component, input } from '@angular/core';
import {Lesson} from '../../../../services/lesson.service';
import {InstrumentEmojiPipe} from '../../../../pipes/instrument-emoji-pipe';

@Component({
  selector: 'app-lesson-created-notification',
  imports: [
    InstrumentEmojiPipe
  ],
  templateUrl: './lesson-created-notification.html',
  styleUrl: './lesson-created-notification.scss',
  host: {
    class: 'py-2'
  }
})
export class LessonCreatedNotification {
  role = input.required<'teacher' | 'student' | 'admin'>();
  lesson = input.required<Lesson>();
}
