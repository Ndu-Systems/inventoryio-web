import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, Company, SellModel, Partner, Orders, Item, Email, ItemOptions } from 'src/app/_models';
import { ProductService, CompanyService, EmailService, InvoiceService } from 'src/app/_services';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { OrderOptions } from 'src/app/_models/order.options.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-shop-checkout',
  templateUrl: './shop-checkout.component.html',
  styleUrls: ['./shop-checkout.component.scss']
})
export class ShopCheckoutComponent implements OnInit {
  welocme = `Welcome to 'ZALOE' shopping page`;
  products$: Observable<Product[]>;
  companyId;
  company: Company;
  sale$: Observable<SellModel>;
  products: Product[];
  selectedPartner: Partner;
  sale: SellModel;
  order: Orders;
  bannerImage = 'assets/placeholders/shopheader.jpg';
  shopPrimaryColor: string;
  shopSecondaryColor: string;
  paymentMethod: string;
  deliveryFee = 150;


  constructor(
    private productService: ProductService,
    private shoppingService: ShoppingService,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private emailService: EmailService,
    private invoiceService: InvoiceService,
    private router: Router,
    private messageService: MessageService,
    private titleService: Title

  ) {


    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
      this.productService.getProducts(this.companyId);
      // this.products$ = this.shoppingService.cart;

      this.companyService.getCompany(this.companyId).subscribe(r => {
        this.company = r;
        this.welocme = `Welcome to '${this.company.Name}' shopping page `;
        this.titleService.setTitle(`${this.welocme} | inventoryio shopping`);
        if (this.company.Banner) {
          this.bannerImage = this.company.Banner[0].Url;
        }

      });
    });
  }
  ngOnInit() {
    this.sale$ = this.shoppingService.sell;
    this.shoppingService.sell.subscribe(state => {
      if (state) {
        this.sale = state;
        console.log('current order', state);
      }
    });
    this.shoppingService.customer.subscribe(state => {
      if (state) {
        this.selectedPartner = state;
      }
    });
    this.productService.products.subscribe(r => {
      this.products = r;
    });
    this.shoppingService.company.subscribe(data => {
      if (data) {
        this.company = data;
        if (this.company.Theme) {
          this.shopPrimaryColor = this.company.Theme.find(x => x.Name === 'shopPrimaryColor').Value;
          this.shopSecondaryColor = this.company.Theme.find(x => x.Name === 'shopSecondaryColor').Value;
        }
      }
    });
  }

  back() {
    // this.shoppingService.setState(this.cart);
    this.router.navigate(['shop/at', this.company.Handler || this.companyId]);
  }

  add(item: Item) {
    const product = this.products.find(x => x.ProductId === item.prodcuId);
    if (Number(product.Quantity) - Number(item.quantity) <= 0) {
      // this.messageService.add({
      //   severity: 'warn',
      //   summary: 'Stock Alert.',
      //   detail: `You run out of ${product.Name}`
      // });
      return false;
    }
    item.quantity++;
    this.shoppingService.doSellLogic(item);
  }
  reduce(item: Item) {
    if (item.quantity <= 0) {
      this.shoppingService.removeItem(item);
      return;
    }
    item.quantity--;
    this.shoppingService.doSellLogic(item);
  }
  removeItem(item: Item) {
    this.shoppingService.removeItem(item);
  }
  blur(item: Item) {
    if (item.quantity <= 0) {
      this.shoppingService.removeItem(item);
      return;
    }

    const product = this.products.find(x => x.ProductId === item.prodcuId);
    if (Number(product.Quantity) - Number(item.quantity) <= 0) {
      // this.messageService.add({
      //   severity: 'warn',
      //   summary: 'Stock Alert.',
      //   detail: `You run out of ${product.Name}`
      // });
      item.quantity = product.Quantity;
      return false;
    }
    this.shoppingService.doSellLogic(item);
  }


  succesful() {
    const email: Email = {
      CompanyName: this.company.Name,
      EmailType: '',
      Email: this.order.Customer && this.order.Customer.EmailAddress,
      ContactNumber: this.company.TelephoneNumber,
      Subject: `${this.company.Name} Invoice to ${this.order.Customer && this.order.Customer.Name}`,
      Message: '',
      DownloadLink: this.invoiceService.getInvoiceURL(this.order.OrdersId),
      InvoiceDate: this.formatDate(this.order.CreateDate),
      Customer: this.order.Customer && this.order.Customer.Name,
    };
    this.sendEmailNow(email);
    this.shoppingService.updateOrderState(null);
    this.router.navigate(['shop/shoping-succesful', this.companyId]);
  }
  sendEmailNow(email: Email) {
    this.emailService.sendEmailInvoice(email).subscribe(data => {
      console.log(data);
    });
  }


  checkout() {
    this.router.navigate(['shop/checkout', this.companyId]);
  }
  formatDate(d: string) {
    const months = ['Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'];

    const days = ['Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'];

    const date = new Date(d);

    return `${date.getDate()}  ${months[date.getMonth()]} ${date.getFullYear()}, ${days[date.getDay()]} `;
  }

  deliveryChanged(data) {
    if (data === 'cash') {
      this.paymentMethod = 'cash';
    }
    if (data === 'eft') {
      this.paymentMethod = 'eft';
    }
  }

  verify() {

  }

  mapitemOptionsToOrderOptions(items: Item[]): OrderOptions[] {
    const options: OrderOptions[] = [];
    items.forEach(item => {

      item.itemOptions.forEach(itemOpt => {
        const optionsItem: OrderOptions = {
          OrderId: '0',
          OptionId: itemOpt.optionId,
          ValueId: 1,
          OptionValue: itemOpt.value,
          OptionName: itemOpt.optionName,
          ValuePrice: 0,
          ValueIdQty: 0,
          CompanyId: this.companyId,
          CreateUserId: 'customer',
          ModifyUserId: 'customer',
          StatusId: 1
        };
        options.push(optionsItem);
      });
      // tslint:disable-next-line: one-variable-per-declaration

    });
    return options;
  }

  onSubmit() {

    if (!this.sale.total) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Empty cart',
        detail: 'Add items in the cart to continue'
      });
      return false;
    }
    if (!this.selectedPartner) {
      this.messageService.add({
        severity: 'warn',
        summary: 'shipping details missing',
        detail: 'Please provide this shipping details.'
      });
      return false;
    }
    const order: Orders = {
      CompanyId: this.companyId,
      Customer: this.selectedPartner || null,
      ParntersId: '',
      OrderType: 'Sell',
      Total: this.sale.total,
      Paid: 0,
      Due: this.sale.total,
      CreateUserId: 'customer',
      ModifyUserId: 'customer',
      Status: 'new',
      StatusId: 1,
      options : this.mapitemOptionsToOrderOptions(this.sale.items)
    };
    console.log(order);
    console.log('items', this.sale.items);
    this.shoppingService.addOrder(order, this.sale.items).subscribe(response => {
      this.order = response;
      this.shoppingService.updateOrderState(this.order);
      this.succesful();
    });
    this.shoppingService.company.subscribe(data => {
      if (data) {
        this.company = data;
        if (this.company.Theme) {
          this.shopPrimaryColor = this.company.Theme.find(x => x.Name === 'shopPrimaryColor').Value;
          this.shopSecondaryColor = this.company.Theme.find(x => x.Name === 'shopSecondaryColor').Value;
        }
      }
    });
  }

}
