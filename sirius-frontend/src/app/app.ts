import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private auth = inject(AuthService);

  protected readonly title = signal('sirius-frontend');

  login() {
    this.auth.login(
      "Ole",
      "Kaps",
      "pass1234",
    );
  }
}
