import { ChildEntity } from 'typeorm';
import { User, UserRoles } from '../../users/entities/user.entity';

@ChildEntity(UserRoles.admin)
export class Admin extends User {}
