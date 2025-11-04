import {Component, inject, OnInit, signal} from '@angular/core';
import { nanoid } from 'nanoid';
import {Lesson} from '../../../../services/lesson.service';
import {AuthService} from '../../../../services/auth.service';
import {NotificationsService} from '../../services/notifications.service';
import {NotificationContainer} from '../notification-container/notification-container';
import {LessonCreatedNotification} from '../lesson-created-notification/lesson-created-notification';
import {LessonStartsNotification} from '../lesson-starts-notification/lesson-starts-notification';

export type Notification = {
  id: string;
  type: 'success' | 'warning' | 'danger';
  kind: 'lesson:created' | 'reminder:lesson-starts';
  data: any;
  role: 'teacher' | 'student' | 'admin'
}

@Component({
  selector: 'app-notifications-manager',
  imports: [
    NotificationContainer,
    LessonCreatedNotification,
    LessonStartsNotification
  ],
  templateUrl: './notifications-manager.html',
  styleUrl: './notifications-manager.scss',
})
export class NotificationsManager implements OnInit {
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationsService);

  notifications = signal<Notification[]>([]);

  ngOnInit() {
    this.notificationsService.onOne<Lesson>('lesson:created', (lesson) => {
      if (location.pathname.endsWith('lessons')) return;

      this.notifications.update((ns) => [
        {
          id: nanoid(),
          type: 'success',
          role: this.authService.getUserRole()!,
          kind: 'lesson:created',
          data: lesson,
        }
      ])
    });

    this.notificationsService.onOne<Lesson>('reminder:lesson-starts', (lesson) => {
      if (location.pathname.split('/').includes('lesson')) return;

      this.notifications.update((ns) => [
        {
          id: nanoid(),
          type: 'success',
          role: this.authService.getUserRole()!,
          kind: 'reminder:lesson-starts',
          data: lesson,
        }
      ])
    });
  }

  handleCloseNotification(id: string) {
    this.notifications.update(ns => ns.filter(n => n.id !== id));
  }
}
