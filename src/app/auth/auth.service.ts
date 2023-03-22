import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  exhaustMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  name?: string;
  id?: number;
  email?: string;
}

export interface LoginResponseData {
  two_factor: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  getCsrfCookie() {
    return this.http.get('http://localhost:8000/sanctum/csrf-cookie');
  }

  signup(email: string, password: string) {
    return this.getCsrfCookie().pipe(
      exhaustMap(() =>
        this.http
          .post<AuthResponseData>('http://localhost:8000/api/register', {
            email: email,
            password: password,
          })
          .pipe(catchError(this.handleError))
      ),
      exhaustMap(() => this.login(email, password))
    );
  }

  login(email: string, password: string) {
    return this.getCsrfCookie().pipe(
      exhaustMap(() =>
        this.http
          .post<LoginResponseData>('http://localhost:8000/api/login', {
            email: email,
            password: password,
          })
          .pipe(catchError(this.handleError))
      ),
      exhaustMap(() => this.getUser())
    );
  }

  getUser() {
    return this.http
      .get<AuthResponseData>('http://localhost:8000/api/user')
      .pipe(
        take(1),
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(resData.email, resData.id, resData.name);
        })
      );
  }

  logout() {
    this.getCsrfCookie()
      .pipe(
        exhaustMap(() =>
          this.http
            .post('http://localhost:8000/api/logout', {})
            .pipe(catchError(this.handleError))
        )
      )
      .subscribe(() => {
        this.user.next(null);
        this.router.navigate(['/auth']);
      });
  }

  private handleAuthentication(email?: string, userId?: number, name?: string) {
    const user = new User(email, userId, name);
    this.user.next(user);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let message = 'An unknown error occurred!';

    if (!errorResponse.error || !errorResponse.error.message) {
      return throwError(() => message);
    } else if ([401].includes(errorResponse.status)) {
      return throwError(() => errorResponse.status);
    }

    return throwError(() => errorResponse.error.message);
  }
}
