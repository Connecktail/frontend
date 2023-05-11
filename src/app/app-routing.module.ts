import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BottleCardComponent } from './component/bottle-card/bottle-card.component';
import { CartModalComponent } from './component/cart-modal/cart-modal/cart-modal.component';
import { CocktailCardComponent } from './component/cocktail-card/cocktail-card.component';
import { CocktailModalComponent } from './component/cocktail-modal/cocktail-modal.component';
import { CocktailPersoModalComponent } from './component/cocktail-perso-modal/cocktail-perso-modal.component';
import { FooterComponent } from './component/footer/footer.component';
import { ListCocktailsComponent } from './pages/list-cocktails/list-cocktails.component';
import { OrderPageComponent } from './pages/order-page/order-page/order-page.component';
import { WebsocketService } from './service/websocket.service';

const routes: Routes = [
  { path: 'list-cocktails', component: ListCocktailsComponent },
  { path: 'list-commands', component: OrderPageComponent },
  {
    path: '',
    redirectTo: '/list-cocktails',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    CommonModule
  ],
  declarations: [
    ListCocktailsComponent,
    CocktailCardComponent,
    BottleCardComponent,
    CocktailModalComponent,
    CartModalComponent,
    CocktailPersoModalComponent,
    OrderPageComponent
  ],
  exports: [RouterModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  
})
export class AppRoutingModule {}
