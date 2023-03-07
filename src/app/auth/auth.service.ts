import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";

export interface AuthResponseData {
    name: string
    id: number
    email: string
}

export interface LoginResponseData {
    two_factor: boolean
}

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {}

    getCsrfCookie() {
        return this.http.get('http://localhost:8000/sanctum/csrf-cookie')
    }

    signup(email: string, password: string) {
        return this.getCsrfCookie().pipe(
            switchMap(() => this.http.post<AuthResponseData>(
                    'http://localhost:8000/api/register',
                    {
                        email: email,
                        password: password
                    }
                ).pipe(
                    catchError(
                        e => {
                            let message = 'An unknown error occurred!'

                            if (!e.error || !e.error.message) {
                                return throwError(() => message)
                            }

                            return throwError(() => e.error.message)
                        }
                    )
                )
            )
        )
    }

    login(email: string, password: string) {
        return this.getCsrfCookie().pipe(
            switchMap(() => this.http.post<LoginResponseData>(
                    'http://localhost:8000/api/login',
                    {
                        email: email,
                        password: password
                    }
                )
            )
        )
    }
}