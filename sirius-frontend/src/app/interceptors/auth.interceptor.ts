import {HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const jwtToken = inject(AuthService).getJwtToken();

  if (jwtToken) {
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${jwtToken}`),
    });
    return next(newReq);
  }

  return next(req);
}
