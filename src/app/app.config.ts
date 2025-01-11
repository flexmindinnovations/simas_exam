import { utils } from './utils';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi, type HttpErrorResponse } from '@angular/common/http';
import { customInterceptor } from './interceptors/custom.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppConfigService, type ApiCallConfig } from './services/config/app-config.service';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AuthService } from './services/auth/auth.service';
import { StudentService } from './services/student/student.service';
import { firstValueFrom, of, throwError, type Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

export function configFactory(configService: AppConfigService): Promise<any> {
  return new Promise((resolve, reject) => {
    resolve(configService.loadStaticSettings());
  })
}

export function initializeAppFactory(
  studentService: StudentService,
  apiConfig: AppConfigService,
  authService: AuthService,
  http: HttpClient
): () => Promise<any> {
  const roleName = sessionStorage.getItem('role') || '';
  if (authService.isLoggedIn()) {
    const secretKey = sessionStorage.getItem('token') || '';
    const usertTypes = ['student'];
    const role = utils.decryptString(roleName, secretKey)?.toLowerCase();
    return () => {
      return new Promise<void>((resolve, reject) => {
        initUserData(studentService, apiConfig, authService, http)
          .then(() => resolve())
          .catch((err) => {
            console.error('Error initializing user data:', err);
            reject(err);
          });
      });
    }
  }

  return () => {
    return Promise.resolve();
  };
}

async function initUserData(
  studentService: StudentService,
  apiService: AppConfigService,
  authService: AuthService,
  http: HttpClient
): Promise<void> {
  const usertTypes = ['student'];
  if (authService.isLoggedIn()) {
    const roleName = sessionStorage.getItem('role') || '';
    const secretKey = sessionStorage.getItem('token') || '';
    if (roleName) {
      const role = utils.decryptString(roleName, secretKey)?.toLowerCase();
      if (usertTypes.includes(role)) {
        const endpoint = getEndpointUrl(role, studentService, apiService, http);
        try {
          const response = await firstValueFrom(endpoint);
          utils.studentDetails.set(response);
        } catch (error) {
          console.error('Failed to get user details', error);
          throw error;
        }
      }
    }
  }
}


function getEndpointUrl(role: string, service: StudentService, apiService: AppConfigService, http: HttpClient): Observable<any> {
  const userId = sessionStorage.getItem('userId');
  const hostUrl: any = environment.apiUrl;
  const studentById = (userId: any) => `${hostUrl}/Student/GetStudentById?id=${userId}`;
  if (userId) {
    switch (role) {
      case 'student':
        return http.get(studentById(userId));
      default:
        console.error('Invalid role:', role);
        break;
    }
  } else {
    console.error('No userId found in localStorage');
  }

  return throwError(() => new Error('Invalid userId or role'));
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([customInterceptor])
    ),
    StudentService,
    AppConfigService,
    AuthService,
    importProvidersFrom(
      NgHttpLoaderModule.forRoot()
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: AppConfigService) => {
        return () => configFactory(configService);
      },
      deps: [AppConfigService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (studentService: StudentService, apiService: AppConfigService, authService: AuthService, http: HttpClient) => {
        return initializeAppFactory(studentService, apiService, authService, http);
      },
      deps: [StudentService, AppConfigService, AuthService, HttpClient],
      multi: true,
    },
  ]
};
