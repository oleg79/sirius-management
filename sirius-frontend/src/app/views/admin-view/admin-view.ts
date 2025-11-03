import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {
  NotificationsManager
} from '../../features/notifications/components/notifications-manager/notifications-manager';

@Component({
  selector: 'app-admin-view',
  imports: [
    RouterLinkActive,
    RouterOutlet,
    RouterLink,
    NotificationsManager
  ],
  templateUrl: './admin-view.html',
  styleUrl: './admin-view.scss',
})
export class AdminView {
  protected authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
