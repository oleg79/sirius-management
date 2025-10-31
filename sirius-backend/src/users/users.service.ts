import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findOne(firstName: string, lastName: string) {
    const result = (await this.repository
      .createQueryBuilder('u')
      .where({ firstName, lastName })
      .select('u.id', 'id')
      .addSelect('u.role', 'role')
      .addSelect('u.firstName', 'firstName')
      .addSelect('u.lastName', 'lastName')
      .addSelect('u.password', 'password')
      .execute()) as [
      {
        id: string;
        role: UserRole;
        firstName: string;
        lastName: string;
        password: string;
      },
    ];

    return result[0];
  }
}
