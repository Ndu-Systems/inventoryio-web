import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, Company, SellModel, Partner, Orders, Item, Email } from 'src/app/_models';
import { ProductService, CompanyService, EmailService, InvoiceService } from 'src/app/_services';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { OrderOptions } from 'src/app/_models/order.options.model';
import { MessageService } from 'primeng/api';
import { Config } from 'src/app/_models/Config';
import { ConfigService } from 'src/app/_services/dashboard/config.service';

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
  selectedType = 'eft';
  step = 1;
  checkedEft: boolean;
  checkedCash: boolean;

  today = new Date();

  paymentMethods = [
    { label: 'EFT Transfer', value: 'eft' },
    { label: ' Cash on delivery', value: 'cash' }
  ];
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
    private configService: ConfigService,
    private titleService: Title

  ) {


    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;

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
          // if (this.company.Shipping) {
          //   this.shippings = this.company.Shipping;
          //   this.groupShipping();
          // }
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
  }

  back() {
    // this.shoppingService.setState(this.cart);
    this.router.navigate(['shop/shopping-cart', this.company.CompanyId || this.companyId]);
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
      // this.messageService.add({
      //   severity: 'warn',
      //   summary: 'Stock Alert.',
      //   detail: `You run out of ${product.Name}`
      // });
      item.quantity = product.Quantity;
      return false;
    }
    this.shoppingService.doSellLogic(item, this.companyId);
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

  onSubmit() {

    if (this.selectedType === 'eft' && !this.checkedEft) {
      this.messageService.add({
        severity: 'warn',
        summary: 'EFT Agree',
        detail: 'Please agree to pay using EFT to the account below.'
      });
      return false;
    }

    if (this.selectedType === 'cash' && !this.checkedCash) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cash Agree',
        detail: 'Please agree to pay cash'
      });
      return false;
    }
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
        detail: 'Please provide  shipping details.'
      });
      return false;
    }
    if (!this.selectedPartner.EmailAddress) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Email address is needed',
        detail: 'Please provide your email adress for invoicing.'
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
      ParntersEmail: this.selectedPartner && this.selectedPartner.EmailAddress || null,
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

    let shipment = {
      ConfigId: '',
      CompanyId: this.company.CompanyId,
      Name: 'shippingFee',
      Label: this.sale.charges[0] && this.sale.charges[0].line || '',
      Type: 'shippingFee',
      GroupKey: '',
      Value: this.sale.charges[0] && this.sale.charges[0].amount || '',
      IsRequired: true,
      FieldType: 'string',
      CreateUserId: 'system',
      ModifyUserId: 'system',
      StatusId: 1
    };
    order.Charges = [shipment];
    // this.configService.addConfigsRange([shipment]);
    this.shoppingService.addOrder(order, this.sale.items).subscribe(response => {
      this.order = response;
      this.shoppingService.updateOrderState(this.order);
      this.messageService.add({
        severity: 'success',
        summary: 'Well done',
        detail: 'Your order was created successfully, please download your invoice and make a payment if you have not done so already.',
        life: 10000,
      });


      this.shoppingService.updateState({
        items: [],
        total: 0,
        companyId: ''
      });

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

  nextStep(step) {
    this.step = step
  }

}
