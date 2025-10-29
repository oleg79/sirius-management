import { ChildEntity, Column, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';

@ChildEntity('teacher')
export class Teacher extends User {
  @Column({ length: 100 })
  instrument: string;

  @Column({ type: 'int' })
  experience: number;

  @ManyToMany(() => Student, (s) => s.teachers)
  @JoinTable({
    name: 'teachers_students',
    joinColumn: {
      name: 'teacher_id',
    },
    inverseJoinColumn: {
      name: 'student_id',
    },
  })
  students: Promise<Student[]>;
}
