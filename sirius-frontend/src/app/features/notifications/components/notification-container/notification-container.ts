import {AfterViewInit, Component, input, output} from '@angular/core';

@Component({
  selector: 'app-notification-container',
  imports: [],
  templateUrl: './notification-container.html',
  styleUrl: './notification-container.scss',
  host: {
    class: 'flex bg-green-50 flex-col gap-2 rounded-sm p-1 shadow-lg',
    '[class.bg-green-50]': "type() === 'success'",
    '[class.bg-yellow-50]': "type() === 'warning'",
    '[class.bg-red-50]': "type() === 'danger'",
  }
})
export class NotificationContainer implements AfterViewInit {
  withSoundEffect = input(true);
  type = input.required<'success' | 'warning' | 'danger'>()

  close = output();

  async ngAfterViewInit() {
    if (!this.withSoundEffect()) return;

    const audio = new Audio('/sounds/notification.mp3');

    try {
      await audio.play();
    } catch {
      //
    }
  }
}
