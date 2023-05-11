import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { last, Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  public $cocktailNumberChanged = new Subject<any>();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;  
  }

  public async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  public async get(key: string) {
    return await this._storage?.get(key);
  }

  public addCocktailToCart(cocktail: any) {
    this._storage?.get('cart').then((cart: any) => {
      if (cart) {
        if(cocktail.id == null) { // cocktail personnalisé
          cart.push(cocktail);
        } else {  // cocktail existant
          let cocktailIndex = cart.findIndex((c: any) => c.id == cocktail.id);
          if(cocktailIndex == -1) {
            cocktail["number"] = 1;
            let inserted = false;
            for(let i in cart) { // on cherche où insérer le cocktail
              if(cart[i].id > cocktail.id || cart[i].id == null) {
                cart.splice(i, 0, cocktail);
                inserted = true;
                break;
              }
            }
            if(!inserted) {cart.push(cocktail);}
          } else {
            cart[cocktailIndex]["number"] += 1;
          }
        }
        
      } else {
        cocktail["number"] = 1;
        cart = [cocktail];
      }
      this._storage?.set('cart', cart);
    });
  }

  public async changeCocktailNumber(cocktailId: number, change: number) {
    this._storage?.get('cart').then(async (cart: any) => {
      let cocktailIndex = cart.findIndex((c: any) => c.id == cocktailId);
      if(cocktailIndex != -1) {
        cart[cocktailIndex]["number"] += change;
        let deleted = false;
        if(cart[cocktailIndex]["number"] <= 0) {
          cart.splice(cocktailIndex, 1);
          deleted = true;
        }
        await this._storage?.set('cart', cart);
        this.$cocktailNumberChanged.next({"cocktailId": cocktailId, "deleted": deleted});
      }
    });
  }

  public async deleteCocktailPerso(cocktailId: number) {
    this._storage?.get('cart').then(async (cart: any) => {
      let cocktailIndex = cart.findIndex((c: any) => c.perso_id == cocktailId);
      if(cocktailIndex != -1) {
        cart.splice(cocktailIndex, 1);
        await this._storage?.set('cart', cart);
        this.$cocktailNumberChanged.next({"cocktailPersoId": cocktailId, "deleted": true});
      }
    });
  }

  public async generateCocktailPersoLastId() {
    return this._storage?.get('lastCocktailPersoId').then(async (id: number) => {
      let cocktailPersoId:number = (id==null)?0:id;
      await this._storage?.set('lastCocktailPersoId', ++cocktailPersoId);
      return cocktailPersoId;
    });
  }

  public async addCocktailPersoLastId() {
    this._storage?.get('lastCocktailPersoId').then(async (lastCocktailPersoId: number) => {
    });
  }
}
