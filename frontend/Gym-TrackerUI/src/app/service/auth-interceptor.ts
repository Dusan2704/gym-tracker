// auth-interceptor.ts (klasni interceptor; drop-in za Angular < funkcionalni stil)
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Auth } from './auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: Auth, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // backend kaže: nije validan token -> logout i send to login
          this.auth.logout();
          // replaceUrl da korisnik ne može "back" do protected stranice
          this.router.navigate(['/login'], { replaceUrl: true });
        }
        return throwError(() => err);
      })
    );
  }
}
