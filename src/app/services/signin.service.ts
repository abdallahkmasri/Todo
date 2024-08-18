import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'src/enviroments/enviroment';
import { ISignIn } from '../models/signin.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SigninService {
  private _url = `${enviroment.url}/Users/login`;
  private tokenKey = 'SecretKey';
  private userIdKey = 'UserId';
  private userNameKey = 'UserName';

  constructor(private http: HttpClient, private router: Router) {}

  signin(user: ISignIn): Observable<any> {
    return this.http.post(this._url, user).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userIdKey, response.userId);
        localStorage.setItem(this.userNameKey, response.userName);
        this.router.navigateByUrl('dashboard');
        return response;
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userNameKey);
    this.router.navigateByUrl('/');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Attach the token to the headers for protected API calls
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getUserName(): string | null{
    return localStorage.getItem(this.userNameKey);
  }
}
