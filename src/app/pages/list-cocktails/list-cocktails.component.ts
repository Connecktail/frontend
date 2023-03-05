import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-cocktails',
  templateUrl: './list-cocktails.component.html',
  styleUrls: ['./list-cocktails.component.scss'],
})
export class ListCocktailsComponent implements OnInit {
  cocktails: any = [];

  constructor() { }

  ngOnInit() {
    for(let i = 0; i < 30; i++) {
      let cocktail = {
        "name": "",
        "price": 0.00,
        "description": "",
      };
      cocktail.name = "Cocktail n°" + (i+1);
      cocktail.price = i+1;
      cocktail.description = "blablabalbalbal - " + (i+1);
      this.cocktails.push(cocktail);
    }
  }

}
