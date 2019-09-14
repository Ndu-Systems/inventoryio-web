import { Component, OnInit } from '@angular/core';
import { SaleService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { SellModel, Item } from 'src/app/_models';

@Component({
  selector: 'app-sale-sammary',
  templateUrl: './sale-sammary.component.html',
  styleUrls: ['./sale-sammary.component.scss']
})
export class SaleSammaryComponent implements OnInit {
  sale$: Observable<SellModel>;
  constructor(private saleService: SaleService) { }

  ngOnInit() {
    this.sale$ = this.saleService.sell;
    this.saleService.sell.subscribe(state => {
      // alert(state);
    });
  }

  add(item: Item) {
    item.quantity++;
    this.saleService.doSellLogic(item);
  }
  reduce(item: Item) {
    if (item.quantity <= 0) {
      this.saleService.removeItem(item);
      return;
    }
    item.quantity--;
    this.saleService.doSellLogic(item);
  }
  close(item: Item) {
    this.saleService.removeItem(item);
  }
  blur(item: Item) {
    if (item.quantity <= 0) {
      this.saleService.removeItem(item);
      return;
    }
    this.saleService.doSellLogic(item);
  }
}
