import { UserRole } from '../../users/entities/user.entity';

export interface RequestUser {
  id: string;
  role: UserRole;
}
