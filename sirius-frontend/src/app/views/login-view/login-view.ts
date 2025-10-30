import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login-view',
  imports: [ReactiveFormsModule],
  templateUrl: './login-view.html',
  styleUrl: './login-view.scss',
})
export class LoginView {
  private authService = inject(AuthService);

  loginForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });


  onSubmit() {
    const { firstName, lastName, password } = this.loginForm.value;

    if (firstName && lastName && password) {
      this.authService.login(firstName, lastName, password);
    }
  }
}
