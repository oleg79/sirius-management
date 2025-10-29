import { ChildEntity, Column, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

@ChildEntity('student')
export class Student extends User {
  @Column({ length: 100 })
  instrument: string;

  @ManyToMany(() => Teacher, (t) => t.students)
  teachers: Promise<Teacher[]>;
}
