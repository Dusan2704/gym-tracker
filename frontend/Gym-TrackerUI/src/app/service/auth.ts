// auth.service.ts (primer)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

const BASE_URL = 'http://localhost:8080/';
@Injectable({ providedIn: 'root' })
export class Auth {
  private TOKEN_KEY = 'token';
  private loggedIn = new BehaviorSubject<boolean>(false); // start false!

  constructor(private http: HttpClient) {
    this.initFromStorage();
  }
  checkEmailExists(email: string): Observable<boolean> {
    if (!email) return of(false); // prazno polje nije problem

    return this.http.get<{ exists: boolean }>(`${BASE_URL}/users/email-exists?email=${email}`)
      .pipe(
        map(res => res.exists),
        catchError(() => of(false)) // u slučaju greške pretpostavi da email ne postoji
      );
  }

  private initFromStorage() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      this.loggedIn.next(false);
      return;
    }
    // lokalna provera exp polja iz JWT (brza, bez zavisnosti)
    if (this.isTokenExpired(token)) {
      localStorage.removeItem(this.TOKEN_KEY);
      this.loggedIn.next(false);
      console.log('[Auth] token expired -> removed');
    } else {
      this.loggedIn.next(true);
      console.log('[Auth] token present and not expired');
    }
  }

  private parseJwt(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const data = this.parseJwt(token);
    if (!data || !data.exp) return true; // nevalidan = tretirati kao expired
    const now = Math.floor(Date.now() / 1000);
    return data.exp <= now;
  }

  saveToken(token: string) {
    if (!token) return;
    localStorage.setItem(this.TOKEN_KEY, token);
    this.loggedIn.next(true);
  }
  register(data: any): Observable<any> {
    return this.http.post(BASE_URL + 'register', data);
  }

  login(data: any): Observable<any> {
    return this.http.post(BASE_URL + 'authentication', data);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedIn.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

