import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cocktail-card',
  templateUrl: './cocktail-card.component.html',
  styleUrls: ['./cocktail-card.component.scss'],
})
export class CocktailCardComponent implements OnInit {
  @Input() cocktail: any;
  math = Math;

  constructor() { }

  ngOnInit() {
  }

}
