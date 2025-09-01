import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from './auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseURL = 'http://localhost:8080/workouts';
 
  constructor(private http: HttpClient, private auth: Auth) {}

  // helper to always include auth header
  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  createWorkout(workout: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseURL}`, workout, { headers });
  }

   getMyWorkouts(): Observable<any> {
     const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseURL}`,{headers});
  }



  getWorkout(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseURL}/${id}`, { headers });
  }

  updateWorkout(id: number, workout: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseURL}/${id}`, workout, { headers });
  }

  deleteWorkout(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.baseURL}/${id}`, {  headers, responseType: 'text' as 'json'});
  }

  
 

}
