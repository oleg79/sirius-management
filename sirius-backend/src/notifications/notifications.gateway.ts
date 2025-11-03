import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../users/entities/user.entity';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: ['http://localhost:4200'],
  },
})
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(socket: Socket) {
    const token = (socket.handshake.auth as null | { token: string })?.token;

    if (!token) {
      socket.emit('auth_error', { message: 'Unauthorized' });
      socket.disconnect(true);
      return;
    }

    const payload = await this.jwtService.verifyAsync<{
      sub: string;
      role: UserRole;
    }>(token, { secret: this.configService.getOrThrow('JWT_SECRET') });

    const userId = payload.sub;

    if (payload.role === 'admin') {
      await socket.join('admins');
    } else {
      await socket.join(`user:${userId}`);
    }
  }

  sendToOne<T>(to: string, eventName: string, data: T) {
    this.server.to(to).emit(eventName, data);
  }

  sendToMany<T>(tos: string[], eventName: string, data: T) {
    for (const to of tos) {
      this.server.to(to).emit(eventName, data);
    }
  }
}
