import {Component, computed} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-student-teachers-component',
  imports: [
    JsonPipe
  ],
  templateUrl: './teachers-component.html',
  styleUrl: './teachers-component.scss',
})
export class TeachersComponent {
  teachersResource = httpResource(() => 'teachers');

  teachers = computed(() => this.teachersResource.value() ?? []);
}
