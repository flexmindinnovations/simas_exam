import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { utils } from '../utils';

export const customInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const authToken = authService.getAuthToken();
  let authReq = req;
  const publicRoutes = ['login', 'createToken', 'register'];
  const requestEndpoint = req.url.substring(req.url.lastIndexOf('/') + 1, req.url.length);
  if (authService.isLoggedIn() && !publicRoutes.includes(requestEndpoint)) {
    authReq = authReq.clone(
      {
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      }
    )
  }
  return next(authReq).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          utils.isUserSessionEnded.set(true);
        } else {

        }
      } else {

      }
      return throwError(() => error);
    })
  );
};
