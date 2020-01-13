import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Service, NotFoundModel } from 'src/app/_models';
import { AccountService, BannerService } from 'src/app/_services';
import { Router } from '@angular/router';
import { NotFoundConstants } from '../../shared';
import { ServiceService } from 'src/app/_services/dashboard/service.service';

@Component({
  selector: 'app-company-services',
  templateUrl: './company-services.component.html',
  styleUrls: ['./company-services.component.scss']
})
export class CompanyServicesComponent implements OnInit {

  search = ``;
  searchByCatergory = ``;
  services$: Observable<Service[]>;
  sum: number;
  totalPrice = 0;
  notFoundModel: NotFoundModel;
  categories: any[];

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService

  ) { }

  ngOnInit() {
    const user = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.services$ = this.serviceService.services;
    this.serviceService.getServices(user.CompanyId);

    this.serviceService.services.subscribe(state => {
      if (state) {
        this.bannerService.updateState({
          heading: 'My services',
          backto: '/dashboard',
          countLabel: 'Total services',
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
      Image: NotFoundConstants.NOT_FOUND_SERVICES.image,
      Message: NotFoundConstants.NOT_FOUND_SERVICES.message
    };
  }
  add() {
    this.router.navigate(['/dashboard/add-company-service']);
  }
  import() {
    this.router.navigate(['/dashboard/data-import']);
  }
  details(service: Service) {
    this.bannerService.updateState({
      backto: '/dashboard/list-service',
    });
    this.serviceService.updateCurrentService(service);
    this.router.navigate([`/dashboard/service-details`]);
  }
  clearSearch() {
    this.search = '';
  }
  myFunc(total, num) {
    return total + num;
  }

}
