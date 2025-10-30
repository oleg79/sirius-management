import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';

export type LessonStatus = 'pending' | 'accepted' | 'rejected';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  teacherId: string;

  @ManyToOne(() => Teacher, (t) => t.lessons)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student, (s) => s.lessons)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected'],
  })
  status: LessonStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
