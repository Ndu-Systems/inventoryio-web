import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, Company, SellModel } from 'src/app/_models';
import { ProductService, CompanyService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  welocme = `Welcome to 'ZALOE' shopping page`;
  products$: Observable<Product[]>;
  cart$: Observable<Product[]>;
  companyId;
  cart: Product[] = [];
  company: Company;
  sale: SellModel;

  constructor(
    private productService: ProductService,
    private shoppingService: ShoppingService,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private titleService: Title,
    private router: Router

  ) {


    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
      this.productService.getProducts(this.companyId);
      this.products$ = this.productService.products;

      this.companyService.getCompany(this.companyId).subscribe(r => {
        this.company = r;
        this.welocme = `Welcome to '${this.company.Name}' shopping page `;
        this.titleService.setTitle(`${this.welocme} | inventoryio shopping`);
        // this.shoppingService.cart.subscribe(data => {
        //   if (data && data.length) {
        //     this.cart = data;
        //   }
        // })

      });
    });
  }

  ngOnInit() {
  }


  viewCart() {
    // this.shoppingService.setState(this.cart);
    this.router.navigate(['shopping-cart', this.companyId]);
  }

  doSell(product: Product) {
    if (this.sale) {
      if ((product.QuantityAvailable <= 0) || (Number(product.Quantity) <= 0)) {
        // this.messageService.add({
        //   severity: 'warn',
        //   summary: 'Stock Alert.',
        //   detail: `You have run out of  ${product.Name}`
        // });
        return false;
      }
      // this.messageService.add({
      //   severity: 'success',
      //   summary: 'Added to cart',
      //   detail: `${product.Name} Added`
      // });
      const item = this.sale.items.find(x => x.prodcuId === product.ProductId);
      if (item) {
        item.quantity++;
        this.shoppingService.doSellLogic(item);
        return;
      }
    }

    this.productService.updateCurrentProduct(product);
    this.shoppingService.doSellLogic(
      { prodcuId: product.ProductId,
      name: product.Name,
      price: Number(product.UnitPrice),
      quantity: 1 ,
      image: product.images && product.images[0].Url
    });
  }

}
