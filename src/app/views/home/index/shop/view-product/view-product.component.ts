import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders, Company, Product, SellModel, ItemOptions } from 'src/app/_models';
import { ProductService, CompanyService, InvoiceService } from 'src/app/_services';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Attribute } from 'src/app/_models/Attribute.model';

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
  product: Product;
  quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  sale: SellModel;
  cartItems: number;
  itemQnty = 1;
  orderOptions: ItemOptions[] = [];
  allOrderOptions: Attribute[] = [];


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
    this.product$.subscribe(data => {
      this.product = data;
      this.allOrderOptions = this.product.Attributes;
    });
    this.shoppingService.sell.subscribe(data => {
      if (data) {
        this.sale = data;
        this.cartItems = this.sale.items.length;
      }
    });
  }

  doSell(product: Product) {
    if (this.sale) {
      if ((product.QuantityAvailable <= 0) || (Number(product.Quantity) <= 0)) {
        return false;
      }
      let isErross = false;

      this.allOrderOptions.forEach(attribute => {
        const checkIfExist = this.orderOptions.find(x => x.optionId === attribute.AttributeId);
        if (!checkIfExist) {
          alert(`${attribute.Name} must be selected.`);
          isErross = true;
        }

      });
      if (isErross) {
        return false;
      }

      const item = this.sale.items.find(x => x.prodcuId === product.ProductId);
      if (item && (JSON.stringify(item.itemOptions) === JSON.stringify(this.orderOptions))) {
        // check if options are still the same.
        item.quantity++;
        this.shoppingService.doSellLogic(item);
        this.orderOptions = [];
      } else {
        this.shoppingService.doSellLogic(
          {
            prodcuId: product.ProductId,
            name: product.Name,
            price: Number(product.UnitPrice),
            quantity: Number(this.itemQnty),
            image: product.images && product.images[0].Url,
            itemOptions: this.orderOptions
          });
        this.orderOptions = [];

      }
    }

    this.productService.updateCurrentProduct(product);

  }

  back() {
    this.router.navigate(['shop', this.companyId]);
  }

  optionSelected(option, AttributeId) {
    const selectValueId = Number(option);
    if (this.orderOptions.find(x => x.optionId === AttributeId)) {
      this.orderOptions = this.orderOptions.filter(x => x.optionId !== AttributeId);
    }
    const attribute = this.product.Attributes.find(x => x.AttributeId === AttributeId);
    const itemOptionn: ItemOptions = {
      optionId: AttributeId,
      optionName: attribute.Name,
      valueId: selectValueId,
      value: attribute.Values.find(x => Number(x.Id) === selectValueId).AttributeValue
    };
    this.pushOptions(itemOptionn);
  }
  pushOptions(orderOption: ItemOptions) {
    if (!this.orderOptions.find(x => x.optionId === orderOption.optionId && x.valueId === orderOption.valueId)) {
      this.orderOptions.push(orderOption);
    }
  }
}
