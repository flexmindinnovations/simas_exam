import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
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
    tap((response) => {
      if(response) utils.isTableLoading.set(false);
    }),
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // Handle unauthorized access, for example:
          utils.isUserSessionEnded.set(true);
          // Set the global error message
          utils.setMessages('Session expired. Please log in again.', 'error');
        } else if (error.status === 500) {
          // Handle server errors
          utils.setMessages('Server error. Please try again later.', 'error');
        } else {
          // Handle other error cases
          utils.setMessages('An unexpected error occurred.', 'error');
        }
      } else {
        // Handle non-HTTP errors (if needed)
        utils.setMessages('An unexpected error occurred.', 'error');
      }

      // Always return the error for the caller to handle it
      utils.isTableLoading.set(false);
      return throwError(() => error);
    })
  );
};
