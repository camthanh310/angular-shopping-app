import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    @Output() feactureSelected = new EventEmitter<string>()

    onSelect(feature: string): void {
        this.feactureSelected.emit(feature)
    }
}