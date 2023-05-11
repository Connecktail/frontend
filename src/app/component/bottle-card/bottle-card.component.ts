import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-bottle-card',
  templateUrl: './bottle-card.component.html',
  styleUrls: ['./bottle-card.component.scss'],
})
export class BottleCardComponent implements OnInit {
  @Input() bottle: any;
  @Input() displayedIn: any;

  @Output() bottleChecked: EventEmitter<any> = new EventEmitter<any>();
  @Output() bottleChangePosition: EventEmitter<any> = new EventEmitter<any>();
  @Output() bottleChangeQuantity: EventEmitter<any> = new EventEmitter<any>();

  math = Math;

  constructor(
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.bottle.quantity = 1;
  }

  checkBottle(event: any) {
    this.bottleChecked.emit({bottle: this.bottle, checked: event.detail.checked});
  }

  changeBottleQuantity(event: any) {
    const value = event.target.value;
    const filteredValue = value.replace(/[^0-9]+/g, '');

    this.bottle.quantity = parseInt(filteredValue);
  }

  async changeCocktailNumber(change: number) {
    this.storageService.changeCocktailNumber(this.bottle.id, change);
  }

}
