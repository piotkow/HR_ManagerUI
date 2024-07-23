import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter, CalendarUtils } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { PermissionService } from './services/permission.service';
import { UploadComponent } from './components/upload/upload.component';
import { ConfirmationService, MessageService } from 'primeng/api';

export function tokenGetter(){
  return localStorage.getItem('access_token')
}

export const appConfig: ApplicationConfig = {
  providers: [
    BrowserAnimationsModule,
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    NgbModule,
    provideAnimations(),
    importProvidersFrom(CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter
        }
      })
    ),
    CalendarUtils,
    AuthService,
    MessageService,
    ConfirmationService
  ],
};
