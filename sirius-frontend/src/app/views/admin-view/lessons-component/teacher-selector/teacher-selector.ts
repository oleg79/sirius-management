import {Component, computed, input, model, output} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {Teacher} from '../../../../services/teacher.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-teacher-selector',
  imports: [
    FormsModule
  ],
  templateUrl: './teacher-selector.html',
  styleUrl: './teacher-selector.scss',
})
export class TeacherSelector {
  teachersResource = httpResource<Teacher[]>(() => 'teachers', { defaultValue: [] });
  teachers = computed(() => this.teachersResource.value());

  selectedTeacherId = model<string>();
}
