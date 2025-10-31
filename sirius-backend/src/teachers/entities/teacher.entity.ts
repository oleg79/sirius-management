import { ChildEntity, Column, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User, UserRoles } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

@ChildEntity(UserRoles.teacher)
export class Teacher extends User {
  @Column({ length: 100 })
  instrument: string;

  @Column({ type: 'int' })
  experience: number;

  @ManyToMany(() => Student, (s) => s.teachers, { onDelete: 'CASCADE' })
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

  @OneToMany(() => Lesson, (l) => l.teacher)
  lessons: Lesson[];
}
