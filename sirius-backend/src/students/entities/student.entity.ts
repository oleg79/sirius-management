import { ChildEntity, Column, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

@ChildEntity('student')
export class Student extends User {
  @Column({ length: 100 })
  instrument: string;

  @ManyToMany(() => Teacher, (t) => t.students, { onDelete: 'CASCADE' })
  teachers: Promise<Teacher[]>;

  @OneToMany(() => Lesson, (l) => l.student)
  lessons: Lesson[];
}
