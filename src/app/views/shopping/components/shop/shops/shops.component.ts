import { Component, OnInit } from '@angular/core';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { Company, Product, Caterory } from 'src/app/_models';
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
  sliderProducts: Product[];
  loading = true;
  company: Company;
  catergories: Caterory[];
  filterCatergories: Caterory[];
  constructor(private shoppingService: ShoppingService, private router: Router, private titleService: Title,


  ) {
    this.titleService.setTitle(`Tybo | Take your business online: Digital Mall`);
  }

  ngOnInit() {
    this.shoppingService.getAllShops().subscribe(data => {
      this.catergories = data;
      this.filterCatergories = this.catergories && this.catergories.filter(x => x.CatergoryType === 'parent') || [];
      this.loading = false;
      // this.shops = data;
      
      // if (this.shops) {
      //   this.mapProducts();
      //   this.loading = false;
      //   this.shoppingService.updateCompaniesState(this.shops);
      // }

    });
  }
  visitShow(shop: Company) {
    this.router.navigate(['at', shop.Handler || shop.CompanyId]);
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
    this.sliderProducts = this.products;
  }

  openMainCatergory(caterory: Caterory) {
    this.router.navigate(['main-category', caterory.CatergoryId]);
  }
  openCatergory(caterory: Caterory) {
    this.router.navigate(['shop-by-category', caterory.CatergoryId]);
  }
}
