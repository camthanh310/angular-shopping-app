import { Component } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    constructor(
        private dataStorageService: DataStorageService,
        private authService: AuthService
    ) {}

    onSaveData() {
        this.dataStorageService.storeRecipes()
    }

    onFetchData() {
        this.authService.getCsrfCookie().subscribe(
            () => {
                this.dataStorageService.fetchRecipes().subscribe()
            }
        )
    }
}