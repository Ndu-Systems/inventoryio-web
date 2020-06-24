import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders, Company, Product, SellModel, Item } from 'src/app/_models';
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
  product: Product;
  quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  sale: SellModel;
  cartItems: number;
  itemQnty = 1;
  orderOptions: OrderOptions[] = [];
  allProductAttributes: Attribute[] = [];
  shopPrimaryColor: string;
  shopSecondaryColor: string;
  bannerImage = 'assets/placeholders/shopheader.jpg';
  welcomed;
  products: Product[];
  loading = true;
  logoUrl: string;
  viewCart: boolean;
  modalHeading: string;

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
      this.initScreen(this.productId);
    });
  }

  ngOnInit() {

  }

  initScreen(productId) {
    this.productService.getProductObservable(productId).subscribe(data => {
      if (data) {
        this.product = data.product;
        this.company = data.company;
        this.products = data.products;
        this.companyId = this.company.CompanyId;
        this.dataReady();
        this.getCurrentCart();
        this.productService.updateState(this.products);
        this.productService.updateSellProductState(this.product);
        this.loading = false;
      }
    });
  }

  dataReady() {
    this.allProductAttributes = this.product.Attributes.filter(x => x.Values && x.Values.length > 0);
    if (this.company) {
      this.titleService.setTitle(`${this.product.Name} | ${this.company.Name}  | Tybo | Take your business online`);
      if (this.company.Theme) {
        this.shopPrimaryColor = this.company.Theme.find(x => x.Name === 'shopPrimaryColor').Value;
        this.shopSecondaryColor = this.company.Theme.find(x => x.Name === 'shopSecondaryColor').Value;
      }
      if (this.company.Banner) {
        this.bannerImage = this.company.Banner[0].Url;
      }
      if (this.company.Logo && this.company.Logo.length) {
        this.logoUrl = this.company.Logo[0].Url;
      }
    }
  }

  getCurrentCart() {
    this.shoppingService.sell.subscribe(data => {
      if (data) {
        if (data.companyId === '') {
          this.sale = data;
          return true;
        }
        if (data.companyId === this.product.CompanyId) {
          this.sale = data;
        } else {
          this.sale = {
            items: [],
            total: 0,
            companyId: ''
          };
          this.shoppingService.updateState(this.sale);
        }
        this.cartItems = this.sale.items.length;
      }
    });
  }

  doSell(product: Product) {
    if (!this.sale) {
      this.sale = {
        items: [],
        total: 0,
        companyId: ''
      };
      this.shoppingService.updateState(this.sale);
    }
    if ((product.QuantityAvailable <= 0) || (Number(product.Quantity) <= 0)) {
      this.messageService.add({
        severity: 'warn',
        summary: `This items run out of stock`,
        detail: `Please contact the show ownwer`
      });
      return false;
    }

    let isErross = false;
    this.allProductAttributes.forEach(attribute => {
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
      this.shoppingService.doSellLogic(item, this.companyId);
      // this.orderOptions = [];
    } else {
      this.shoppingService.doSellLogic(
        {
          prodcuId: product.ProductId,
          companyId: product.CompanyId,
          name: product.Name,
          price: Number(product.UnitPrice),
          quantity: Number(this.itemQnty),
          image: product.Images && product.Images[0].Url,
          options: this.orderOptions
        }, this.companyId);
      // this.orderOptions = [];

    }
    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Added to cart',
    //   detail: `${product.Name} Added`
    // });
    this.viewCart = true;
    this.modalHeading = `${product.Name} added to cart!`;

    this.productService.updateCurrentProduct(product);

  }

  back() {
    this.router.navigate(['at', this.company.Handler || this.company.CompanyId]);
  }
  checkout() {
    this.router.navigate(['checkout', this.company.Handler || this.company.CompanyId]);
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

  changeItemQnty(count: number) {
    if (count < 0 && this.itemQnty <= 1) {
      return false;
    }
    this.itemQnty += count;
  }

  add(item: Item) {
    // const product = this.products.find(x => x.ProductId === item.prodcuId);
    // if (Number(product.Quantity) - Number(item.quantity) <= 0) {
    //   return false;
    // }
    item.quantity++;
    this.shoppingService.doSellLogic(item, this.companyId);
  }
  reduce(item: Item) {
    if (item.quantity <= 0) {
      this.shoppingService.removeItem(item);
      return;
    }
    item.quantity--;
    this.shoppingService.doSellLogic(item, this.companyId);
  }
  removeItem(item: Item) {
    this.shoppingService.removeItem(item);
  }
}
