import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-cocktail-card',
  templateUrl: './cocktail-card.component.html',
  styleUrls: ['./cocktail-card.component.scss'],
})
export class CocktailCardComponent implements OnInit {
  @Input() cocktail: any;
  @Input() displayedIn: any;

  @Output() cocktailSelected: EventEmitter<any> = new EventEmitter<any>();

  math = Math;

  constructor(
    private storageService: StorageService
  ) {}

  ngOnInit() {
  }

  selectCocktail() {
    this.cocktailSelected.emit(this.cocktail);
  }

  async changeCocktailNumber(change: number) {
    this.storageService.changeCocktailNumber(this.cocktail.id, change);
  }

  deleteCocktailPerso() {
    this.storageService.deleteCocktailPerso(this.cocktail.perso_id);
  }

}
