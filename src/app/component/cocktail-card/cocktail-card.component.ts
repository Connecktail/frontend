import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cocktail-card',
  templateUrl: './cocktail-card.component.html',
  styleUrls: ['./cocktail-card.component.scss'],
})
export class CocktailCardComponent implements OnInit {
  @Input() cocktail: any;

  @Output() cocktailSelected: EventEmitter<any> = new EventEmitter<any>();

  math = Math;

  constructor() { }

  ngOnInit() {
  }

  selectCocktail() {
    this.cocktailSelected.emit(this.cocktail);
  }

}
