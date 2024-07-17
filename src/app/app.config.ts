import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { customInterceptor } from './interceptors/custom.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppConfigService } from './services/config/app-config.service';
import { NgHttpLoaderModule } from 'ng-http-loader';

export function configFactory(configService: AppConfigService): Promise<any> {
  return new Promise((resolve, reject) => {
    resolve(configService.loadStaticSettings());
  })
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
    importProvidersFrom(
      NgHttpLoaderModule.forRoot()
    ),
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: AppConfigService) => () => configFactory(configService),
      deps: [AppConfigService],
      multi: true
    }
  ]
};
