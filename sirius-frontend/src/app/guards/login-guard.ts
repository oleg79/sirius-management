import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  const role = authService.getUserRole()!;

  switch (role) {
    case 'teacher':
      return router.createUrlTree(['/teacher']);
    case 'student':
      return router.createUrlTree(['/student']);
    case 'admin':
      return router.createUrlTree(['/admin']);
    default:
      throw new Error('UNKNOWN ROLE');
  }
};
