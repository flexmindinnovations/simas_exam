import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const customInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const authToken = authService.getAuthToken();
  let authReq = req;
  const publicRoutes = ['login', 'createToken', 'register'];

  if (authService.isLoggedIn()) {
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

        } else {

        }
      } else {

      }
      return throwError(() => error);
    })
  );
};
