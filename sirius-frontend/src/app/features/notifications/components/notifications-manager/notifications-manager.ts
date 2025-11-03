import {Component, inject, OnInit, signal} from '@angular/core';
import { nanoid } from 'nanoid';
import {Lesson} from '../../../../services/lesson.service';
import {AuthService} from '../../../../services/auth.service';
import {NotificationsService} from '../../services/notifications.service';

@Component({
  selector: 'app-notifications-manager',
  imports: [],
  templateUrl: './notifications-manager.html',
  styleUrl: './notifications-manager.scss',
})
export class NotificationsManager implements OnInit {
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationsService);

  notifications = signal<{ id: string; title: string; text: string; }[]>([]);

  ngOnInit() {
    this.notificationsService.onOne<Lesson>('lesson:created', (lesson) => {
      if (location.pathname.endsWith('lessons')) return;

      this.notifications.update((ns) => [
        { id: nanoid(), title: 'NEW LESSON', text: `with ${lesson.teacher.firstName} ${lesson.teacher.lastName}` }, ...ns
      ])
    });
  }

  handleCloseNotification(id: string) {
    this.notifications.update(ns => ns.filter(n => n.id !== id));
  }
}
