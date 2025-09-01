import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { JwtInterceptor } from './app/jwtinterceptor';
import { NgFor, NgIf } from '@angular/common';
import { AuthInterceptor } from './app/service/auth-interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptors([JwtInterceptor])),
    
    provideRouter(routes),
    importProvidersFrom(ReactiveFormsModule, FormBuilder, FormGroup, Validators, EmailValidator,NgIf,NgFor,
    
      // dodaj još module ako si koristio AppModule
    ), provideCharts(withDefaultRegisterables())
  ]
})
.catch(err => console.error(err));
