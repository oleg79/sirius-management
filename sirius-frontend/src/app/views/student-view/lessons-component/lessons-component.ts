import { Component } from '@angular/core';
import {httpResource} from '@angular/common/http';

@Component({
  selector: 'app-lessons-component',
  imports: [],
  templateUrl: './lessons-component.html',
  styleUrl: './lessons-component.scss',
})
export class LessonsComponent {
  lessons = httpResource(() => 'lessons');
}
