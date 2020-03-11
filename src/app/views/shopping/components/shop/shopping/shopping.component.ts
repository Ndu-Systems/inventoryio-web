import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/_models';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss']
})
export class ShoppingComponent implements OnInit {
  company: Company;
  shopPrimaryColor = '#fff';
  shopSecondaryColor: any;

  constructor(private shoppingService: ShoppingService,
  ) { }

  ngOnInit() {

    this.shoppingService.company.subscribe(data => {
      if (data) {
        this.company = data;
        if (this.company.Theme) {
          this.shopPrimaryColor = this.company.Theme.find(x => x.Name === 'shopPrimaryColor').Value;
          this.shopSecondaryColor = this.company.Theme.find(x => x.Name === 'shopSecondaryColor').Value;
        }
      }
    });

  }

}
