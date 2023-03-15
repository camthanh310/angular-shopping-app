import { Component, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthResponseData, AuthService, LoginResponseData } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoginMode: boolean = true
    isLoading: boolean = false
    error: string = ''
    @ViewChild(PlaceholderDirective, { static: false }) alertHost!: PlaceholderDirective

    private closeSubscription!: Subscription

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnDestroy(): void {
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe()
        }
    }

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
                        this.showErrorAlert(e)
                        this.isLoading = false
                    },
                    complete: () => {
                        this.isLoading = false
                    }
                }
            )


        form.reset()
    }

    onHandleError() {
        this.error = ''
    }

    private showErrorAlert(message: string) {
        const hostViewContainerRef = this.alertHost.viewContainerRef
        hostViewContainerRef.clear()
        const componentRef = hostViewContainerRef.createComponent(AlertComponent)

        componentRef.instance.message = message
        this.closeSubscription = componentRef.instance.close.subscribe(
            () => {
                this.closeSubscription.unsubscribe()
                hostViewContainerRef.clear()
            }
        )
    }
}