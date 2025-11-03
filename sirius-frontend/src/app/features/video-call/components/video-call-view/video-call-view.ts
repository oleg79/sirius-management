import {Component, ElementRef, inject, OnInit, signal, viewChild} from '@angular/core';
import {VideoCallsService} from '../../services/video-calls.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';



@Component({
  selector: 'app-video-call-view',
  imports: [],
  templateUrl: './video-call-view.html',
  styleUrl: './video-call-view.scss',
})
export class VideoCallView implements OnInit {
  private videoCallsService = inject(VideoCallsService);
  private activatedRoute = inject(ActivatedRoute);

  private localStream!: MediaStream;

  videoEnabled = signal(true);
  micEnabled = signal(true);
  everyoneConnected = this.videoCallsService.everyoneConnected;

  localVideoEl = viewChild.required<ElementRef<HTMLVideoElement>>('localVideo');
  remoteVideoEl = viewChild.required<ElementRef<HTMLVideoElement>>('remoteVideo');

  async ngOnInit() {
    this.activatedRoute.paramMap.pipe(map(pm => pm.get('id'))).subscribe(async (lessonId) => {
      if (lessonId) {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min:640, ideal:1920, max:1920 },
            height: { min:480, ideal:1080, max:1080 },
          },
          audio: true,
        });

        const remoteStream$ = this.videoCallsService.init(lessonId, this.localStream);

        this.localVideoEl().nativeElement.srcObject = this.localStream;

        remoteStream$.subscribe((remoteStream) => {
          this.remoteVideoEl().nativeElement.srcObject = remoteStream;
        })
      }
    })
  }

  toggleCamera() {
    const videoTrack = this.localStream.getVideoTracks()[0];

    videoTrack.enabled = !videoTrack.enabled;
    this.videoEnabled.set(videoTrack.enabled);
  }

  toggleMic() {
    const audioTrack = this.localStream.getAudioTracks()[0];

    audioTrack.enabled = !audioTrack.enabled;
    this.micEnabled.set(audioTrack.enabled);
  }

  leaveLesson() {
    window.close();
  }
}
