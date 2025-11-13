import { Module } from '@nestjs/common';
import { VideoCallsGateway } from './video-calls.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [VideoCallsGateway],
  imports: [JwtModule],
})
export class VideoCallsModule {}
