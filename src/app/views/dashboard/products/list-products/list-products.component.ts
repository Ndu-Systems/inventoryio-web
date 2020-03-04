import { Component, OnInit } from '@angular/core';
import { ProductService, AccountService, BannerService, ScannerService } from 'src/app/_services';
import { Product, NotFoundModel } from 'src/app/_models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotFoundConstants } from '../../shared';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  search = ``;
  searchByCatergory = ``;
  products$: Observable<Product[]>;
  products: Product[];
  sum: number;
  totalPrice = 0;
  notFoundModel: NotFoundModel;
  categories: any[];
  showScan: boolean;
  productBarcode: string;

  constructor(
    private productService: ProductService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService,
    private scannerService: ScannerService,
    private messageService: MessageService


  ) { }

  ngOnInit() {
    const user = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.products$ = this.productService.products;
    this.productService.getProducts(user.CompanyId);

    this.productService.products.subscribe(state => {
      if (state) {
        this.bannerService.updateState({
          heading: 'My Products',
          backto: '/dashboard',
          countLabel: 'Total Products',
          count: state.length
        });
        const categories = state.map(c => c.Catergory && c.Catergory.Name || '') || [];
        this.categories = categories.filter((item, index) => categories.indexOf(item) === index);
        this.categories = this.categories.filter(c => c !== '' && c !== undefined && c !== null);
        this.sum = state.length;
        const prices = state.map(x => Number(x.UnitPrice) * Number(x.Quantity)) || [0];
        this.totalPrice = prices.reduce(this.myFunc, 0);
      }
    });
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_PRODUCTS.image,
      Message: NotFoundConstants.NOT_FOUND_PRODUCTS.message
    };

    this.scannerService.scann.subscribe(scan => {
      if (scan  && window.location.href.includes('list-product')) {
        this.showScan = scan.isOpen;
        if (scan.code) {
          const product = this.products.find(x => x.Code === scan.code);
          if (product) {
            this.details(product);
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: `Barcode: ${scan.code}`,
              detail: `Scanned product not found`
            });
          }
        }

      }
    });
    this.products = this.productService.currentProducts;
  }
  add() {
    this.router.navigate(['/dashboard/add-product']);
  }
  import() {
    this.router.navigate(['/dashboard/data-import']);
  }
  details(product: Product) {
    this.bannerService.updateState({
      backto: '/dashboard/list-product',
    });
    debugger
    this.productService.updateCurrentProduct(product);
    this.router.navigate([`/dashboard/product-details`]);
  }
  clearSearch() {
    this.search = '';
  }
  myFunc(total, num) {
    return total + num;
  }
  scann() {
    this.showScan = true;
  }
}
