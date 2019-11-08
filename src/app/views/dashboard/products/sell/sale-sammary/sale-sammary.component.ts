import { Component, OnInit } from '@angular/core';
import { SaleService, ProductService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { SellModel, Item, Product } from 'src/app/_models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sale-sammary',
  templateUrl: './sale-sammary.component.html',
  styleUrls: ['./sale-sammary.component.scss']
})
export class SaleSammaryComponent implements OnInit {
  sale$: Observable<SellModel>;
  products: Product[];
  constructor(
    private saleService: SaleService,
    private messageService: MessageService,
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.sale$ = this.saleService.sell;
    this.saleService.sell.subscribe(state => {
    });
    this.productService.products.subscribe(r => {
      this.products = r;
    });
  }

  add(item: Item) {
    const product = this.products.find(x => x.ProductId === item.prodcuId);
    if (Number(product.Quantity) - Number(item.quantity) <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Stock Alert.',
        detail: `You run out of ${product.Name}`
      });
      return false;
    }
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
    removeItem(item: Item) {
      this.saleService.removeItem(item);
    }
    blur(item: Item) {
      if (item.quantity <= 0) {
        this.saleService.removeItem(item);
        return;
      }

      const product = this.products.find(x => x.ProductId === item.prodcuId);
      if (Number(product.Quantity) - Number(item.quantity) <= 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Stock Alert.',
          detail: `You run out of ${product.Name}`
        });
        item.quantity = product.Quantity;
        return false;
      }
      this.saleService.doSellLogic(item);
    }
  }
