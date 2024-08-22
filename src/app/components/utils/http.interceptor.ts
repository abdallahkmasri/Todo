import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SigninService } from 'src/app/services/signin.service';

@Injectable({
  providedIn: 'root',
})
export class TodoInterceptor implements HttpInterceptor {
  constructor(private signinService: SigninService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.signinService.getToken();

    if (token) {
      let headers = req.headers;

      headers = headers.set('Authorization', `Bearer ${token}`);

      // Add Content-Type header if not already set and the request body is present
      if (!headers.has('Content-Type') && req.body) {
        headers = headers.set('Content-Type', 'application/json');
      }

      const authReq = req.clone({
        headers: headers,
      });

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
