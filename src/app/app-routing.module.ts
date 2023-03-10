import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CocktailCardComponent } from './component/cocktail-card/cocktail-card.component';
import { CocktailModalComponent } from './component/cocktail-modal/cocktail-modal.component';
import { FooterComponent } from './component/footer/footer.component';
import { ListCocktailsComponent } from './pages/list-cocktails/list-cocktails.component';
import { WebsocketService } from './service/websocket.service';

const routes: Routes = [
  { path: 'list-cocktails', component: ListCocktailsComponent },
  { path: 'list-commands', component: ListCocktailsComponent },
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
    CocktailModalComponent
  ],
  exports: [RouterModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  
})
export class AppRoutingModule {}
