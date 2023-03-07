import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>()

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Tasty Schnitze',
    //         'This is simply a test',
    //         'https://www.clipartmax.com/png/small/362-3624236_icon-preset-recipe-icon.png',
    //         [
    //             new Ingredient('Meat', 1),
    //             new Ingredient('French Fries', 20)
    //         ]
    //     ),
    //     new Recipe(
    //         'Big Fat Burger',
    //         'This is simply a test',
    //         'https://www.clipartmax.com/png/small/362-3624236_icon-preset-recipe-icon.png',
    //         [
    //             new Ingredient('Buns', 2),
    //             new Ingredient('Meat', 1)
    //         ]
    //     )
    // ]
    private recipes: Recipe[] = []

    constructor(private shoppingListService: ShoppingListService) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes
        this.recipesChanged.next(this.recipes.slice())
    }

    getRecipes(): Recipe[] {
        return this.recipes.slice()
    }

    getRecipe(index: number): Recipe {
        return this.recipes[index]
        // return this.recipes.slice()[index]
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]): void {
        this.shoppingListService.addIngredients(ingredients)
    }

    addRecipe(recipe: Recipe): void {
        this.recipes.push(recipe)
        this.recipesChanged.next(this.recipes.slice())
    }

    updateRecipe(index: number, newRecipe: Recipe): void {
        this.recipes[index] = newRecipe
        this.recipesChanged.next(this.recipes.slice())
    }

    deleteRecipe(index: number): void {
        this.recipes.splice(index, 1)
        this.recipesChanged.next(this.recipes.slice())
    }
}