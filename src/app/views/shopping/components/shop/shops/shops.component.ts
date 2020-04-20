import { Component, OnInit } from '@angular/core';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { Company, Product } from 'src/app/_models';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {
  shops: Company[] = [];
  searchType = 'shops';
  showResultBox: boolean;
  searchResults: Company[] = [];
  searchResultsProducts: Product[] = [];
  products: Product[] = [];
  loading = true;
  constructor(private shoppingService: ShoppingService, private router: Router, private titleService: Title,


  ) {
    this.titleService.setTitle(`Inventory IO: Digital Mall`);
  }

  ngOnInit() {
    this.shoppingService.getAllShops().subscribe(data => {
      this.shops = data;
      if (this.shops) {
        this.mapProducts();
        this.loading = false;
      }

    });
  }
  visitShow(shop: Company) {
    this.router.navigate(['shop/at', shop.Handler || shop.CompanyId]);
  }
  visitProduct(product: Product) {
    this.router.navigate(['shop/view-product', product.ProductId]);
  }
  scroll() {
    window.scrollBy(0, 1100);
  }
  search(keyword: string) {
    if (keyword.length >= 1 && this.searchType === 'shops') {
      this.showResultBox = true;
      this.searchResults = [];
      this.searchResults = this.shops.filter(
        x => x.Name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()) ||
          (x.Description || '').toLocaleLowerCase().includes(keyword.toLocaleLowerCase()));
      console.log(this.searchResults);
    }

    if (keyword.length >= 1 && this.searchType === 'products') {
      this.showResultBox = true;
      this.searchResults = [];

      this.searchResultsProducts = this.products.filter(
        x => x.Name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()) ||
          (x.Description || '').toLocaleLowerCase().includes(keyword.toLocaleLowerCase()));
    }
  }

  mapProducts() {
    this.shops.map(x => x.Products).forEach(x => {
      if (x && x.length) {
        x.forEach(p => {
          this.products.push(p);
        });
      }
    });
    console.log('   this.products', this.products);
  }
}
