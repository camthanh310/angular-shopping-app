import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthResponseData, AuthService, LoginResponseData } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode: boolean = true
    isLoading: boolean = false
    error: string = ''

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    onSwitchMode(): void {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit(form: NgForm): void {
        if (!form.valid) {
            return
        }

        const email = form.value.email
        const password = form.value.password

        this.isLoading = true

        let authObserverble: Observable<LoginResponseData|AuthResponseData>

        if (this.isLoginMode) {
            authObserverble = this.authService.login(email, password)
        } else {
            authObserverble = this.authService.signup(email, password)
        }

        authObserverble.subscribe(
                {
                    next: (v) => {
                        console.log(v);
                        this.router.navigate(['/recipes'])
                    },
                    error: (e) => {
                        console.error(e)
                        this.error = e
                        this.isLoading = false
                    },
                    complete: () => {
                        this.isLoading = false
                    }
                }
            )


        form.reset()
    }
}