import {Component, inject, input, linkedSignal, output} from '@angular/core';
import {Teacher} from '../../../../services/teacher.service';
import {httpResource} from '@angular/common/http';
import {Student, StudentService} from '../../../../services/student.service';

@Component({
  selector: 'app-students-manager',
  imports: [],
  templateUrl: './students-manager.html',
  styleUrl: './students-manager.scss',
})
export class StudentsManager {
  private studentService = inject(StudentService);

  teacher = input.required<Teacher>();

  allStudentsResource = httpResource<Student[]>(() => `students?instrument=${this.teacher().instrument}`);

  assignedStudentsResource = httpResource<Student[]>(() => `teachers/${this.teacher().id}/students`);

  students = linkedSignal(() => {
    const assignedStudents = this.assignedStudentsResource.value() ?? [];
    const allStudents = this.allStudentsResource.value() ?? [];

    const assignedStudentIds = assignedStudents.map(s => s.id);

    return allStudents.map(s => ({
      ...s,
      assigned: assignedStudentIds.includes(s.id)
    }))
  });

  close = output();

  async assignStudent(id: string) {
    await this.studentService.assign(id, { teacherId: this.teacher().id, assign: true });

    this.students.update(ss => ss.map(s => s.id !== id ? s : {
      ...s,
      assigned: true
    }))
  }

  async unassignStudent(id: string) {
    await this.studentService.assign(id, { teacherId: this.teacher().id, assign: false });

    this.students.update(ss => ss.map(s => s.id !== id ? s : {
      ...s,
      assigned: false
    }))
  }
}
