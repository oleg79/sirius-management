import { ChildEntity, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ChildEntity('student')
export class Student extends User {
  @Column({ length: 100 })
  instrument: string;
}
