import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders, Company, Product, SellModel } from 'src/app/_models';
import { ProductService, CompanyService, InvoiceService } from 'src/app/_services';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Attribute } from 'src/app/_models/Attribute.model';
import { MessageService } from 'primeng/api';
import { OrderOptions } from 'src/app/_models/order.options.model';

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
  orderOptions: OrderOptions[] = [];
  allOrderOptions: Attribute[] = [];
  shopPrimaryColor: string;
  shopSecondaryColor: string;
  bannerImage = 'assets/placeholders/shopheader.jpg';


  constructor(
    private productService: ProductService,
    private shoppingService: ShoppingService,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private router: Router,
    private titleService: Title,
    private messageService: MessageService,

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

    this.shoppingService.company.subscribe(data => {
      if (data) {
        this.company = data;
        if (this.company.Theme) {
          this.shopPrimaryColor = this.company.Theme.find(x => x.Name === 'shopPrimaryColor').Value;
          this.shopSecondaryColor = this.company.Theme.find(x => x.Name === 'shopSecondaryColor').Value;
        }
        if (this.company.Banner) {
          this.bannerImage = this.company.Banner[0].Url;
        }
      }
    });
  }

  doSell(product: Product) {
    if (!this.sale) {
      this.shoppingService.updateState({
        items: [],
        total: 0
      });
    }
    if ((product.QuantityAvailable <= 0) || (Number(product.Quantity) <= 0)) {
      alert('no stock')
      return false;
    }

    let isErross = false;
    this.allOrderOptions.forEach(attribute => {
      const checkIfExist = this.orderOptions.find(x => x.OptionId === attribute.AttributeId);
      if (!checkIfExist) {
        this.messageService.add({
          severity: 'warn',
          summary: `${attribute.Name} option needed`,
          detail: `${attribute.Name} must be selected.`
        });
        isErross = true;
      }

    });
    if (isErross) {
      return false;
    }

    const item = this.sale.items.find(x => x.prodcuId === product.ProductId);
    if (item && (JSON.stringify(item.options) === JSON.stringify(this.orderOptions))) {
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
          options: this.orderOptions
        });
      this.orderOptions = [];

    }
    this.messageService.add({
      severity: 'success',
      summary: 'Added to cart',
      detail: `${product.Name} Added`
    });

    this.productService.updateCurrentProduct(product);

  }

  back() {
    this.router.navigate(['shop/at', this.company.Handler || this.company.CompanyId]);
  }

  optionSelected(option, attributeId) {
    const selectValueId = Number(option);
    if (this.orderOptions.find(x => x.OptionId === attributeId)) {
      this.orderOptions = this.orderOptions.filter(x => x.OptionId !== attributeId);
    }
    const attribute = this.product.Attributes.find(x => x.AttributeId === attributeId);
    const itemOptionn: OrderOptions = {
      Id: '1',
      OrderId: 'na',
      ProductId: this.product.ProductId,
      OrderProductId: 'na',
      OptionId: attributeId,
      ValueId: selectValueId,
      OptionValue: attribute.Values.find(x => Number(x.Id) === selectValueId).AttributeValue,
      OptionName: attribute.Name,
      ValuePrice: this.product.UnitPrice,
      ValueIdQty: this.product.Quantity,
      CompanyId: this.company.CompanyId,
      CreateUserId: 'customer',
      ModifyUserId: 'customer',
      StatusId: 1
    };
    this.pushOptions(itemOptionn);
  }
  pushOptions(orderOption: OrderOptions) {
    if (!this.orderOptions.find(x => x.OptionId === orderOption.OptionId && x.ValueId === orderOption.ValueId)) {
      this.orderOptions.push(orderOption);
    }
  }
}
