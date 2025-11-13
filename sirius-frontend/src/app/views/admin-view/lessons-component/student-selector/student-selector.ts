import {Component, computed, input, model} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {httpResource} from '@angular/common/http';
import {Student} from '../../../../services/student.service';

@Component({
  selector: 'app-student-selector',
  imports: [
    FormsModule
  ],
  templateUrl: './student-selector.html',
  styleUrl: './student-selector.scss',
})
export class StudentSelector {
  teacherId = input.required<string>();

  studentsResource = httpResource<Student[]>(() => `teachers/${this.teacherId()}/students`, { defaultValue: [] });
  students = computed(() => this.studentsResource.value());

  selectedStudentId = model<string>();
}
