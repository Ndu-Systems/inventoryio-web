import { Component, OnInit, Input } from '@angular/core';
import { Company, Caterory } from 'src/app/_models';
import { ShoppingService } from 'src/app/_services/home/shoping';

@Component({
  selector: 'app-categories-slider',
  templateUrl: './categories-slider.component.html',
  styleUrls: ['./categories-slider.component.scss']
})
export class CategoriesSliderComponent implements OnInit {
  shops: Company[];
  categories: Caterory[] = [];
  constructor(private shoppingService: ShoppingService) { }

  ngOnInit() {
    this.shoppingService.companies.subscribe(data => {
      if (data) {
        this.shops = data;
        this.shops.forEach(shop => {
          if (shop.Catergories) {
            this.categories = [...this.categories, ...shop.Catergories]
          }
        });
      }
    });


  }

}
