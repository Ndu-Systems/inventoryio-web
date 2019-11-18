import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User, Partner, NotFoundModel } from 'src/app/_models';
import { BannerService, PartnerService, AccountService } from 'src/app/_services';
import { StatusConstant, NotFoundConstants } from '../../shared';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent implements OnInit {
  type: any;
  search: string;
  partners$: Observable<Partner[]>;

  showForm: boolean;
  notFoundModel: NotFoundModel;

  searchType: any;
  constructor(
    private bannerService: BannerService,
    private partnerService: PartnerService,
    private accountService: AccountService,
    private routeTo: Router,
    private activatedRoute: ActivatedRoute,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.type = r.id;
      this.searchType = this.type.slice(0, -1);

    });
  }

  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.accountService.logout();
      this.routeTo.navigate(['sign-in']);
    }

    this.bannerService.updateState({
      heading: 'Manage partners',
      backto: '/dashboard/configurations'
    });
    this.partners$ = this.partnerService.partners;
    this.partnerService.getPartners(user.CompanyId);
    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_ITEMS.image,
      Message: NotFoundConstants.NOT_FOUND_ITEMS.message
    };
  }

  add() {
    this.routeTo.navigate([`dashboard/add-partner/${this.type}`]);
  }
  showAdd() {
    this.showForm = !this.showForm;
  }

}
