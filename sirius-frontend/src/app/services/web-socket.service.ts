import {inject, Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private authService = inject(AuthService);
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl, {
      auth: {
        token: this.authService.getJwtToken(),
        userId: this.authService.getUserId(),
      }
    });
  }

  onOne<T>(eventName: string, callback: (message: T) => void): void {
    this.socket.on(eventName, callback);
  }

  onMany<T>(eventNames: string[], callback: (message: T) => void): void {
    for (const eventName of eventNames) {
      this.socket.on(eventName, callback);
    }
  }
}
