import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';

export const rootRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const role = authService.getUserRole();

  switch (role) {
    case 'teacher':
      return router.createUrlTree(['/teacher']);
    case 'student':
      return router.createUrlTree(['/student']);
    case 'admin':
      return router.createUrlTree(['/admin']);
    default:
      return router.createUrlTree(['/login']);
  }
};
