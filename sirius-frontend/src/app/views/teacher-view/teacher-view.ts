import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-teacher-view',
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './teacher-view.html',
  styleUrl: './teacher-view.scss',
})
export class TeacherView {
  protected authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
