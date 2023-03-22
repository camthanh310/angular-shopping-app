import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients!: Ingredient[]
  private subscription!: Subscription

  constructor(private shoppingListService: ShoppingListService, private loggingService: LoggingService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients()
    this.subscription = this.shoppingListService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients
        }
      )

    this.loggingService.printLog('hello from ShoppingListComponent ngOnInit')
  }

  onEditItem(index: number): void {
    this.shoppingListService.startedEditing.next(index)
  }
}
