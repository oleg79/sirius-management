import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  namespace: '/video-calls',
  cors: {
    origin: ['http://localhost:4200'],
  },
})
export class VideoCallsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(socket: Socket) {
    const { token, lessonId } =
      (socket.handshake.auth as null | { token: string; lessonId: string }) ??
      {};

    if (!token) {
      socket.emit('auth_error', { message: 'Unauthorized' });
      socket.disconnect(true);
      return;
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });
    } catch {
      //
    }

    await socket.join(`lesson:${lessonId}`);

    socket.broadcast.emit('video-call:participant-joined');
  }

  async handleDisconnect(client: Socket) {
    const { lessonId } = client.handshake.auth as { lessonId: string };
    await client.leave(`lesson:${lessonId}`);

    this.server.emit('video-call:participant-left');
  }

  @SubscribeMessage('video-call:icecandidate')
  handleIceCandidate(
    @MessageBody() data: { candidate: RTCIceCandidate },
    @ConnectedSocket() client: Socket,
  ) {
    const { lessonId } = client.handshake.auth as { lessonId: string };

    client.broadcast
      .to(`lesson:${lessonId}`)
      .emit('video-call:icecandidate', data.candidate);
  }

  @SubscribeMessage('video-call:offer')
  handleOffer(
    @MessageBody() data: { offer: RTCSessionDescriptionInit },
    @ConnectedSocket() client: Socket,
  ) {
    const { lessonId } = client.handshake.auth as { lessonId: string };

    client.broadcast
      .to(`lesson:${lessonId}`)
      .emit('video-call:offer', data.offer);
  }

  @SubscribeMessage('video-call:answer')
  handleAnswer(
    @MessageBody() data: { answer: RTCSessionDescriptionInit },
    @ConnectedSocket() client: Socket,
  ) {
    const { lessonId } = client.handshake.auth as { lessonId: string };

    client.broadcast
      .to(`lesson:${lessonId}`)
      .emit('video-call:answer', data.answer);
  }
}
