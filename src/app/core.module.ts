import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthenticationIntereceptorService } from "./auth/authentication-interceptor.service";
// import { LoggingService } from "./logging.service";
import { RecipeService } from "./recipes/recipe.service";
import { AuthInterceptorService } from "./shared/auth-interceptor.service";
import { XsrfTokenInterceptorService } from "./shared/xsrf-token-interceptor.service";
import { ShoppingListService } from "./shopping-list/shopping-list.service";

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XsrfTokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationIntereceptorService,
      multi: true
    },
    ShoppingListService,
    RecipeService,
    // LoggingService
    // AuthGuard
  ]
})
export class CoreModule {}