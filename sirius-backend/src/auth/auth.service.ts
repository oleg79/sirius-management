import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOne(
      signInDto.firstName,
      signInDto.lastName,
    );

    if (!user) throw new NotFoundException('User not found');

    const correctPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!correctPassword) throw new UnauthorizedException();

    const payload = {
      sub: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
