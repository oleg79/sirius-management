import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  static readonly TOKEN_STORAGE_KEY = 'jwt-token';
  // We use sessionStorage so we can login under different accounts in separate tabs.
  private static readonly STORAGE = sessionStorage;

  getJwtToken() {
    return AuthService.STORAGE.getItem(AuthService.TOKEN_STORAGE_KEY);
  }

  setJwtToken(token: string) {
    AuthService.STORAGE.setItem(AuthService.TOKEN_STORAGE_KEY, token);
  }

  getUser() {
    const token = this.getJwtToken();

    if (!token) return null;

    return jwtDecode<{
      sub: string;
      role: 'admin' | 'teacher' | 'student';
      firstName: string;
      lastName: string
    }>(token);
  }

  getUserRole() {
    return this.getUser()?.role;
  }

  getUserFullName() {
    const user = this.getUser();

    if (!user) return null;

    return `${user.firstName} ${user.lastName}`;
  }

  isAuthenticated() {
    const token = this.getJwtToken();

    return Boolean(token);
  }

  login(firstName: string, lastName: string, password: string) {
    this.http.post<{access_token: string}>('auth/login', {
      firstName,
      lastName,
      password,
    }).subscribe((res) => {
      this.setJwtToken(res.access_token);
      const role = this.getUserRole()!;

      switch (role) {
        case 'teacher':
          void this.router.navigate(['teacher']);
          break;
        case 'student':
          void this.router.navigate(['student']);
          break;
        case 'admin':
          void this.router.navigate(['admin']);
          break;
        default:
          throw new Error('UNKNOWN ROLE');
      }
    });
  }

  logout() {
    AuthService.STORAGE.removeItem(AuthService.TOKEN_STORAGE_KEY);
    void this.router.navigate(['login']);
  }
}
