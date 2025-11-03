import {inject, Injectable, signal} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Subject} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {environment} from '../../../../environments/environment';

const PEER_CONFIG: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
      ]
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class VideoCallsService {
  private authService = inject(AuthService);

  private socket: Socket;
  private peerConnection!: RTCPeerConnection;
  private remoteStream$ = new Subject<MediaStream>();

  everyoneConnected = signal(false);

  constructor() {
    this.socket = io(`${environment.apiUrl}/video-calls`, {
      autoConnect: false,
    });
  }

  init(lessonId: string, localStream: MediaStream) {
    this.socket.auth = {
      token: this.authService.getJwtToken(),
      lessonId,
    };

    this.socket.on('video-call:participant-joined', async () => {
      this.createPeerConnection(localStream);

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      this.socket.emit('video-call:offer', { offer });
    });

    this.socket.on('video-call:participant-left', () => {
      this.everyoneConnected.set(false);
    });

    this.socket.on('video-call:offer', async (offer: RTCSessionDescriptionInit) => {
      this.createPeerConnection(localStream);

      await this.peerConnection.setRemoteDescription(offer);

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.socket.emit('video-call:answer', { answer });
    });

    this.socket.on('video-call:answer', (answer: RTCSessionDescriptionInit) => {
      if (!this.peerConnection.currentRemoteDescription) {
        this.peerConnection.setRemoteDescription(answer);
      }
    });

    this.socket.on('video-call:icecandidate', (candidate: RTCIceCandidate) => {
      this.peerConnection.addIceCandidate(candidate)
    });

    this.socket.connect();

    return this.remoteStream$;
  }

  private createPeerConnection(localStream: MediaStream) {
    this.peerConnection = new RTCPeerConnection(PEER_CONFIG);
    const remoteStream = new MediaStream();
    this.remoteStream$.next(remoteStream);

    localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, localStream);
    })

    this.peerConnection.addEventListener('track', (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    });

    this.peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        this.socket.emit('video-call:icecandidate', { candidate: event.candidate });
      }
    });

    this.everyoneConnected.set(true);
  }
}
