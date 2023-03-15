import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthenticationIntereceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService
  ) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(
        user => {
          return next.handle(req)
        }
      ),
    )
  }
}