import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders, Company } from 'src/app/_models';
import { ProductService, CompanyService, InvoiceService } from 'src/app/_services';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shoping-succesful',
  templateUrl: './shoping-succesful.component.html',
  styleUrls: ['./shoping-succesful.component.scss']
})
export class ShopingSuccesfulComponent implements OnInit {
  order$: Observable<Orders>;
  companyId: any;
  thankyou = 'Thank you for shopping with us';
  company: Company;

  constructor(
    private productService: ProductService,
    private shoppingService: ShoppingService,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private invoiceService: InvoiceService,
    private router: Router,
    private titleService: Title

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
      this.productService.getProducts(this.companyId);
      // this.products$ = this.shoppingService.cart;

      this.companyService.getCompany(this.companyId).subscribe(r => {
        this.company = r;
        this.thankyou = 'Thank you for shopping with ' + this.company.Name;

      });
    });
  }

  ngOnInit() {
    this.order$ = this.shoppingService.order;
  }

  print(order: Orders) {
    const url = this.invoiceService.getInvoiceURL(order.OrdersId);
    const win = window.open(url, '_blank');
    win.focus();
  }
  back() {
    this.router.navigate(['shop/at', this.company.Handler || this.companyId]);
  }
}
