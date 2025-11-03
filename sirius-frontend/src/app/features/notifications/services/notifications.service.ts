import {inject, Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {AuthService} from '../../../services/auth.service';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private authService = inject(AuthService);
  private socket: Socket;

  constructor() {
    this.socket = io(`${environment.apiUrl}/notifications`, {
      auth: {
        token: this.authService.getJwtToken(),
        userId: this.authService.getUserId(),
      }
    });
  }

  onOne<T>(eventName: string, callback: (message: T) => void) {
    this.socket.on(eventName, callback);
  }

  onMany<T>(eventNames: string[], callback: (message: T) => void) {
    for (const eventName of eventNames) {
      this.socket.on(eventName, callback);
    }
  }
}
