import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    private recipes: Recipe[] = [
        new Recipe(
            'Tasty Schnitze',
            'This is simply a test',
            'https://www.clipartmax.com/png/small/362-3624236_icon-preset-recipe-icon.png',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French Fries', 20)
            ]
        ),
        new Recipe(
            'Big Fat Burger',
            'This is simply a test',
            'https://www.clipartmax.com/png/small/362-3624236_icon-preset-recipe-icon.png',
            [
                new Ingredient('Buns', 2),
                new Ingredient('Meat', 1)
            ]
        )
    ]

    constructor(private shoppingListService: ShoppingListService) { }

    getRecipes(): Recipe[] {
        return this.recipes.slice()
    }

    getRecipe(index: number): Recipe {
        return this.recipes.slice()[index]
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]): void {
        this.shoppingListService.addIngredients(ingredients)
    }
}