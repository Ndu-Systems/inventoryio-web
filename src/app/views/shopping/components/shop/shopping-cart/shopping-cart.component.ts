import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, Company, Item, SellModel, Orders, Partner, Email } from 'src/app/_models';
import { ProductService, CompanyService, EmailService, InvoiceService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { Config } from 'src/app/_models/Config';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
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
  deliveryFee = 0;
  shippings: Config[] = [];
  shippingsList = [];
  selectedShippingMethod: any;
  currency = 'R';
  cartItems: number;
  logoUrl: string;


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

      this.companyService.getCompany(this.companyId).subscribe(data => {
        if (data) {
          this.company = data;
          this.company = data;
          if (this.company.Theme) {
            this.shopPrimaryColor = this.company.Theme.find(x => x.Name === 'shopPrimaryColor').Value;
            this.shopSecondaryColor = this.company.Theme.find(x => x.Name === 'shopSecondaryColor').Value;
          }
          if (this.company.Logo && this.company.Logo.length) {
            this.logoUrl = this.company.Logo[0].Url;
          }
          if (this.company.Shipping) {
            this.shippings = this.company.Shipping;
            this.groupShipping();
          }
        }

      });
    });
  }
  ngOnInit() {
    this.sale$ = this.shoppingService.sell;
    this.shoppingService.sell.subscribe(state => {
      if (state) {
        this.sale = state;
        this.cartItems = this.sale.items.length;

      }
    });

    this.shoppingService.company.subscribe(data => {
      this.company = data;
    });

    this.productService.products.subscribe(r => {
      this.products = r;
    });
  }


  back() {
    // this.shoppingService.setState(this.cart);
    this.router.navigate(['shop/at', this.company.Handler || this.company.CompanyId]);
  }

  add(item: Item) {
    const product = this.products.find(x => x.ProductId === item.prodcuId);
    if (Number(product.Quantity) - Number(item.quantity) <= 0) {
      return false;
    }
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
  blur(item: Item) {
    if (item.quantity <= 0) {
      this.shoppingService.removeItem(item);
      return;
    }

    const product = this.products.find(x => x.ProductId === item.prodcuId);
    if (Number(product.Quantity) - Number(item.quantity) <= 0) {
      item.quantity = product.Quantity;
      return false;
    }
    this.shoppingService.doSellLogic(item, this.companyId);
  }


  onSubmit() {

    if (!this.sale.total) {
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
      StatusId: 1
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
      // console.log(data);
    });
  }


  checkout() {
    if (!this.selectedShippingMethod && this.shippings.length > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Shipping Method not selected',
        detail: 'Please select shipping method before you checkout.'
      });
      return false;
    }
    this.sale.charges = [this.selectedShippingMethod];
    this.shoppingService.updateState(this.sale);
    // save order shipping details


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
    if (data === 'delivery') {
      this.selectedShippingMethod = undefined;
      return false;
    }
    const cost = this.shippingsList.find(x => x.key === data);
    if (cost && !isNaN(cost.amount)) {
      this.deliveryFee = Number(cost.amount);
      this.selectedShippingMethod = cost;
    } else {
      this.deliveryFee = 0;
      this.selectedShippingMethod = cost;
    }
    console.log(cost);
    this.sale.Shipping = this.selectedShippingMethod;
    this.shoppingService.updateState(this.sale);

  }
  groupShipping() {
    const groupedItems: { key: string, data: Config[] }[] = [];
    this.shippings.forEach(item => {
      if (!groupedItems.find(x => x.key === item.GroupKey)) {
        groupedItems.push({
          data: this.shippings.filter(x => x.GroupKey === item.GroupKey),
          key: item.GroupKey
        });
      }
    });
    // console.log('nn', groupedItems);
    groupedItems.forEach(x => {
      x.data.forEach(vals => { });
      let item =
        `${this.findConfigByName('name', x.data)}-  ${this.currency}${this.findConfigByName('amount', x.data)}`;
      if (isNaN(this.findConfigByName('amount', x.data))) {
        item = `${this.findConfigByName('name', x.data)}- ${this.findConfigByName('amount', x.data)}`;
      }
      this.shippingsList.push({
        line: item,
        amount: this.findConfigByName('amount', x.data),
        key: this.findConfigKeyByName('amount', x.data),
      });

    });
  }

  findConfigByName(name: string, items) {
    return (items.find(x => x.Name === name).Value || '').trim();
  }
  findConfigKeyByName(name: string, items) {
    return items.find(x => x.Name === name).GroupKey;
  }
}
