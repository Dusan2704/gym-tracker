// auth-interceptor.spec.ts
import { authInterceptor } from './auth-interceptor';
import { HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';

describe('authInterceptor', () => {

  it('should add Authorization header if token exists', (done) => {
    localStorage.setItem('token', 'fake-token');

    const req = new HttpRequest('GET', '/test');

    const nextFn = (request: HttpRequest<any>): Observable<HttpEvent<any>> => {
      // Proveravamo da li je header dodat
      expect(request.headers.get('Authorization')).toBe('Bearer fake-token');
      return of(new HttpResponse({ status: 200 }));
    };

    authInterceptor(req, nextFn).subscribe({
      next: (event) => {
        expect(event).toBeInstanceOf(HttpResponse);
        done();
      },
      error: done.fail
    });

    localStorage.removeItem('token'); // čišćenje
  });

  it('should not add Authorization header if token does not exist', (done) => {
    localStorage.removeItem('token');

    const req = new HttpRequest('GET', '/test');

    const nextFn = (request: HttpRequest<any>): Observable<HttpEvent<any>> => {
      expect(request.headers.has('Authorization')).toBe(false);
      return of(new HttpResponse({ status: 200 }));
    };

    authInterceptor(req, nextFn).subscribe({
      next: (event) => {
        expect(event).toBeInstanceOf(HttpResponse);
        done();
      },
      error: done.fail
    });
  });

});
