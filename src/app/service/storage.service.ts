import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  public $cocktailNumberChanged = new Subject<void>();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  public get(key: string) {
    return this._storage?.get(key);
  }

  public addCocktailToCart(cocktail: any) {
    this._storage?.get('cart').then((cart: any) => {
      if (cart) {
        let cocktailIndex = cart.findIndex((c: any) => c.id == cocktail.id);
        if(cocktailIndex == -1) {
          cocktail["number"] = 1;
          cart.push(cocktail);
        } else {
          cart[cocktailIndex]["number"] += 1;
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
        if(cart[cocktailIndex]["number"] <= 0) {
          cart.splice(cocktailIndex, 1);
        }
        await this._storage?.set('cart', cart);
        this.$cocktailNumberChanged.next();
      }
    });
  }
}
