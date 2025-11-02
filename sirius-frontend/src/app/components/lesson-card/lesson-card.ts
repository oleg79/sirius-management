import {Component, computed, input} from '@angular/core';
import {Lesson, LessonStatus} from '../../services/lesson.service';
import {InstrumentEmojiPipe} from '../../pipes/instrument-emoji-pipe';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-lesson-card',
  imports: [
    InstrumentEmojiPipe,
    DatePipe
  ],
  templateUrl: './lesson-card.html',
  styleUrl: './lesson-card.scss',
})
export class LessonCard {
  lesson = input.required<Lesson>();

  withTeacher = input(true);

  withStudent = input(true);

  status = input.required<LessonStatus | 'past'>();

  durationInMins = computed(() => {
    const { startTime, endTime } = this.lesson();
    // @ts-ignore
    const timeDiff = new Date(endTime) - new Date(startTime);
    return timeDiff / (1000 * 60);
  });
}
