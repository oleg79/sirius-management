import { ChildEntity, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ChildEntity('teacher')
export class Teacher extends User {
  @Column({ length: 100 })
  instrument: string;

  @Column({ type: 'int' })
  experience: number;
}
