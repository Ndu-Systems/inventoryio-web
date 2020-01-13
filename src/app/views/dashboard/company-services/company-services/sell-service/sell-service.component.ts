import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/_models/service.model';
import { Observable } from 'rxjs';
import { NotFoundModel, SellModel, User, Partner, Orders, Item } from 'src/app/_models';
import { MessageService } from 'primeng/api';
import { ServiceService } from 'src/app/_services/dashboard/service.service';
import { Router } from '@angular/router';
import { AccountService, BannerService, SaleService, PartnerService } from 'src/app/_services';
import { SellserviceService } from 'src/app/_services/dashboard/sellservice.service';
import { NotFoundConstants } from '../../../shared';
@Component({
  selector: 'app-sell-service',
  templateUrl: './sell-service.component.html',
  styleUrls: ['./sell-service.component.scss']
})
export class SellServiceComponent implements OnInit {

  search: string;
  services$: Observable<Service[]>;
  sale: SellModel;
  user: User;
  services: Service[];
  categories: string[] = [];
  showCart = true;
  searchByCatergory;
  width: number;
  notFoundModel: NotFoundModel;
  // results = [];

  selectedCustomerId = '';
  customers: Partner[] = [];
  customers$: Observable<Array<Partner>>;

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService,
    private saleService: SaleService,
    private messageService: MessageService,
    private sellserviceService: SellserviceService,
    private partnerService: PartnerService


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.serviceService.getServices(this.user.CompanyId);
    this.services$ = this.serviceService.services;
    this.serviceService.services.subscribe(data => {
      this.services = data;
      this.getDeviceSize();
      const categories = data.map(c => c.Catergory && c.Catergory.Name || '') || [];
      this.categories = categories.filter((item, index) => categories.indexOf(item) === index);
      this.categories = this.categories.filter(c => c !== '' && c !== undefined && c !== null);
    });


    this.saleService.sell.subscribe(state => {
      this.sale = state;
    });

    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_SALES.image,
      Message: NotFoundConstants.NOT_FOUND_SALES.message
    };
    this.partnerService.getPartners(this.user.CompanyId);
    this.partnerService.partners.subscribe(data => {
      this.customers = data;
    });
    this.customers$ = this.partnerService.partners;
  }
  add() {
    this.router.navigate(['/dashboard/add-Service']);
  }
  doSell(Service: Service) {
    if (this.sale) {
      if ((Service.QuantityAvailable <= 0) || (Number(Service.Quantity) <= 0)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Stock Alert.',
          detail: `You have run out of  ${Service.Name}`
        });
        return false;
      }
      const item = this.sale.items.find(x => x.prodcuId === Service.ServiceId);
      if (item) {
        item.quantity++;
        this.saleService.doSellLogic(item);
        return;
      }
    }

    this.serviceService.updateCurrentService(Service);
    this.saleService.doSellLogic({ prodcuId: Service.ServiceId, name: Service.Name, price: Number(Service.UnitPrice), quantity: 1 });
  }
  clear() {
    this.saleService.clearState();
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
    this.sellserviceService.updateServiceOrderState(null);
    const order: Orders = {
      CompanyId: this.user.CompanyId,
      ParntersId: this.selectedCustomerId,
      OrderType: 'Sell',
      Total: this.sale.total,
      Paid: 0,
      Due: this.sale.total,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      Status: 'new',
      StatusId: 1
    };
    console.log(order);
    console.log('items', this.sale.items);
    this.sellserviceService.addQoute(order, this.sale.items);
    // this.updateServicesRange(this.sale.items);  do no do stock adjusment
    // clear state
    this.saleService.clearState();
    this.sellserviceService.updateServiceOrderState(null);
    this.sellserviceService.updateServiceOrderProductsState(null);
    this.router.navigate(['/dashboard/qoutes-list']);
  }

  updateServicesRange(items: Item[]) {
    const Services: Service[] = [];
    items.forEach(item => {
      const Service = this.services.find(x => x.ServiceId === item.prodcuId);
      Service.Quantity = Number(Service.Quantity) - Number(item.quantity);
      Services.push(Service);
    });
    this.serviceService.updateServiceRange(Services);
  }
  details(Service: Service) {
    this.serviceService.updateCurrentService(Service);
    this.bannerService.updateState({
      backto: '/dashboard/sell',
    });
    this.router.navigate([`/dashboard/Service-details`]);
  }
  clearSearch() {
    this.search = '';
  }
  getDeviceSize() {
    this.width = screen.width;
    console.log(this.width);
    this.showCart = this.width >= 720;
  }
  toggleCart() {
    this.showCart = !this.showCart;
  }
  addCustomer() {
    this.bannerService.updateState({
      backto: `/dashboard/qoute-customer`,
    });
    this.router.navigate(['/dashboard/add-partner/customers']);
  }

}
