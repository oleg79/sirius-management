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

  onOne<T>(eventName: string, callback: (message: T) => void) {
    this.socket.on(eventName, callback);
  }

  onMany<T>(eventNames: string[], callback: (message: T) => void) {
    for (const eventName of eventNames) {
      this.socket.on(eventName, callback);
    }
  }

  emit<T>(eventName: string, data: T) {
    this.socket.emit(eventName, data);
  }

  emitWithAck<T, U = any>(eventName: string, data: U): Promise<T> {
    return this.socket.emitWithAck(eventName, data);
  }
}
