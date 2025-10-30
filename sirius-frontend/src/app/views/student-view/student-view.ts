import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-student-view',
  imports: [
    RouterLinkActive,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './student-view.html',
  styleUrl: './student-view.scss',
})
export class StudentView {
  protected authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
