import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders, Company, Product, SellModel } from 'src/app/_models';
import { ProductService, CompanyService, InvoiceService } from 'src/app/_services';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.components.scss']
})
export class ViewProductComponent implements OnInit {

  order$: Observable<Orders>;
  companyId: string;
  productId: string;
  thankyou = 'Thank you for shopping with us';
  company: Company;
  product$: Observable<Product>;
  quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  sale: SellModel;
  cartItems: number;


  constructor(
    private productService: ProductService,
    private shoppingService: ShoppingService,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private router: Router,
    private titleService: Title
    

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.productId = r.id;
      this.companyService.getCompany(this.companyId).subscribe(r => {
        this.productId = r;
      });
    });
  }

  ngOnInit() {
    // this.order$ = this.shoppingService.order;
    this.product$ = this.productService.sellItem;
    this.shoppingService.sell.subscribe(data => {
      if (data) {
        this.sale = data;
        this.cartItems = this.sale.items.length;
      }
    })
  }

  doSell(product: Product) {
    debugger
    if (this.sale) {
      if ((product.QuantityAvailable <= 0) || (Number(product.Quantity) <= 0)) {
        return false;
      }
      const item = this.sale.items.find(x => x.prodcuId === product.ProductId);
      if (item) {
        item.quantity++;
        this.shoppingService.doSellLogic(item);
        return;
      }
    }

    this.productService.updateCurrentProduct(product);
    this.shoppingService.doSellLogic(
      {
        prodcuId: product.ProductId,
        name: product.Name,
        price: Number(product.UnitPrice),
        quantity: 1,
        image: product.images && product.images[0].Url
      });
  }

  back() {
    this.router.navigate(['shop', this.companyId]);
  }

}
