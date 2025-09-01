import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  constructor(private http: HttpClient) {}

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isValid(token: string): boolean {
    // Ovde možeš da dekodiraš JWT i proveriš expiry
    return !!token; 
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return throwError(() => 'Nema refresh tokena');

    return this.http.post<{ accessToken: string }>('/auth/refresh', { refreshToken })
      .pipe(
        map(res => {
          localStorage.setItem('accessToken', res.accessToken);
          return res.accessToken;
        }),
        catchError(err => throwError(() => err))
      );
  }
}
