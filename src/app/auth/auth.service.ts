import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Subject, switchMap, tap, throwError } from "rxjs";
import { User } from "./user.model";

export interface AuthResponseData {
    name?: string
    id?: number
    email?: string
}

export interface LoginResponseData {
    two_factor: boolean
}

@Injectable()
export class AuthService {
    user = new Subject<User>()

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
                    catchError(this.handleError),
                )
            ),
            switchMap(() => this.login(email, password))
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
                ).pipe(
                    catchError(this.handleError)
                )
            ),
            switchMap(() => this.getUser())
        )

    }

    getUser() {
        return this.http.get<AuthResponseData>('http://localhost:8000/api/user')
                .pipe(
                    catchError(this.handleError),
                    tap(
                        resData => {
                            this.handleAuthentication(resData.email, resData.id, resData.name)
                        }
                    )
                )
    }

    private handleAuthentication(email?: string, userId?: number, name?: string) {
        const user = new User(email, userId, name)
        this.user.next(user)
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let message = 'An unknown error occurred!'

        if (!errorResponse.error || !errorResponse.error.message) {
            return throwError(() => message)
        }

        return throwError(() => errorResponse.error.message)
    }
}