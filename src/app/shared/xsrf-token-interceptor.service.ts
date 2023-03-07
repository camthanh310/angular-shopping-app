import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class XsrfTokenInterceptorService implements HttpInterceptor {
    constructor(
        private tokenService: HttpXsrfTokenExtractor
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (['GET', 'HEAD'].includes(req.method)) {
            return next.handle(req)
        }

        const token = this.tokenService.getToken()
        let request = req

        if (token !== null && !req.headers.has('X-XSRF-TOKEN')) {
            request = req.clone({
                setHeaders: { 'X-XSRF-TOKEN': token }
            })
        }

        return next.handle(request)
    }

}