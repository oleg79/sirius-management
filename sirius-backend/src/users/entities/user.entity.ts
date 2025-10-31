import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  TableInheritance,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export const UserRoles = {
  admin: 'admin',
  teacher: 'teacher',
  student: 'student',
} as const;

export type UserRole = keyof typeof UserRoles;

@Entity()
@Index('users_name_idx', ['lastName', 'firstName'])
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
