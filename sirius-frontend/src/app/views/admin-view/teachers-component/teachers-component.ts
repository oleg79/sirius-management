import {Component, inject, linkedSignal, signal} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Teacher, TeacherService} from '../../../services/teacher.service';
import {InstrumentEmojiPipe} from '../../../pipes/instrument-emoji-pipe';
import {StudentsManager} from './students-manager/students-manager';

const INSTRUMENT_OPTIONS = [
  { value: 'guitar', label: 'guitar' },
  { value: 'piano', label: 'piano' },
  { value: 'vocal', label: 'vocal' },
  { value: 'drums', label: 'drums' }
] as const;

@Component({
  selector: 'app-teachers-component',
  imports: [
    ReactiveFormsModule,
    InstrumentEmojiPipe,
    StudentsManager
  ],
  templateUrl: './teachers-component.html',
  styleUrl: './teachers-component.scss',
})
export class TeachersComponent {
  private teacherService = inject(TeacherService);

  teachersResource = httpResource<Teacher[]>(() => 'teachers');

  teachers = linkedSignal(() => this.teachersResource.value() ?? []);

  selectedTeacher = signal<Teacher | null>(null);

  teacherForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    experience: new FormControl(1, [Validators.required]),
    instrument: new FormControl(INSTRUMENT_OPTIONS[0].value),
  });

  readonly instrumentOptions = INSTRUMENT_OPTIONS;

  async createTeacher() {
    const { firstName, lastName, password, experience, instrument } = this.teacherForm.value;

    if (!(firstName && lastName && password && experience && instrument)) return;

    const teacher = await this.teacherService.create({ firstName, lastName, password, experience, instrument });

    this.teachers.update((ts) => [...ts, teacher]);

    this.teacherForm.reset({
      experience: 1,
      instrument: INSTRUMENT_OPTIONS[0].value,
    });
  }

  async deleteTeacher(id: string) {
    await this.teacherService.delete(id);

    this.teachers.update((ts) => ts.filter(t => t.id !== id))
  }
}
