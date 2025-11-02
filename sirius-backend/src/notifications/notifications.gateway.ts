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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    socket.data.userId = userId;

    console.log('JOINED:', userId);

    await socket.join(`user:${userId}`);
  }

  sendTo<T>(userId: string, eventName: string, data: T) {
    this.server.to(`user:${userId}`).emit(eventName, data);
  }
}
