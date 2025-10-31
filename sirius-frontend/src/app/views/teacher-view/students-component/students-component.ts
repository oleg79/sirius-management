import {Component, computed} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {Student} from '../../../services/student.service';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-teacher-students-component',
  imports: [
    JsonPipe
  ],
  templateUrl: './students-component.html',
  styleUrl: './students-component.scss',
})
export class StudentsComponent {
  studentsResource = httpResource<Student[]>(() => 'students');

  students = computed(() => this.studentsResource.value() ?? []);
}
