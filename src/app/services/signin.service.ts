import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'src/enviroments/enviroment';
import { ISignIn } from '../models/signin.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class SigninService {
  private _url = `${enviroment.url}/Users/login`;
  private tokenKey = 'SecretKey';

  constructor(private http: HttpClient, private router: Router) {}

  signin(user: ISignIn): Observable<any> {
    return this.http.post(this._url, user).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);

        if (this.isAuthenticated()) this.router.navigateByUrl('dashboard');

        return response;
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigateByUrl('/');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.UserName || null;
    }
    return null;
  }
}
