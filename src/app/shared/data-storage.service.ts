import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { map, tap } from "rxjs/operators"
import { Recipe } from "../recipes/recipe.model"
import { RecipeService } from "../recipes/recipe.service"

@Injectable()
export class DataStorageService {
    constructor(
        private http: HttpClient,
        private recipeService: RecipeService
    ) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes()
        this.http.post('http://localhost:8000/api/recipes', recipes)
            .subscribe(
                response => {
                    console.log(response);
                }
            )
    }

    fetchRecipes() {
        console.log('good job man');
        return this.http.get<Recipe[]>('http://localhost:8000/api/recipes')
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients || []
                        }
                    })
                }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes)
                })
            )

    }
}