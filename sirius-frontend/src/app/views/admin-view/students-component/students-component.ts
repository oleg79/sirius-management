import {Component, inject, linkedSignal} from '@angular/core';
import {InstrumentEmojiPipe} from '../../../pipes/instrument-emoji-pipe';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {httpResource} from '@angular/common/http';
import {Student, StudentService} from '../../../services/student.service';

const INSTRUMENT_OPTIONS = [
  { value: 'guitar', label: 'guitar' },
  { value: 'piano', label: 'piano' },
  { value: 'vocal', label: 'vocal' },
  { value: 'drums', label: 'drums' }
] as const;

@Component({
  selector: 'app-students-component',
  imports: [
    InstrumentEmojiPipe,
    ReactiveFormsModule
  ],
  templateUrl: './students-component.html',
  styleUrl: './students-component.scss',
})
export class StudentsComponent {
  private studentService = inject(StudentService);

  studentsResource = httpResource<Student[]>(() => 'students');

  students = linkedSignal(() => this.studentsResource.value() ?? []);

  studentForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    instrument: new FormControl(INSTRUMENT_OPTIONS[0].value),
  });

  readonly instrumentOptions = INSTRUMENT_OPTIONS;

  async createStudent() {
    const { firstName, lastName, password, instrument } = this.studentForm.value;

    if (!(firstName && lastName && password && instrument)) return;

    const student = await this.studentService.create({ firstName, lastName, password, instrument });

    this.students.update((ss) => [...ss, student]);

    this.studentForm.reset({
      instrument: INSTRUMENT_OPTIONS[0].value,
    });
  }

  async deleteStudent(id: string) {
    await this.studentService.delete(id);

    this.students.update((ss) => ss.filter(s => s.id !== id))
  }
}
