import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, BannerService } from 'src/app/_services';
import { User } from 'src/app/_models';
import { Config, newBankArray } from 'src/app/_models/Config';
import { ConfigService } from 'src/app/_services/dashboard/config.service';

@Component({
  selector: 'app-company-view-configs',
  templateUrl: './company-view-configs.component.html',
  styleUrls: ['./company-view-configs.component.scss']
})
export class CompanyViewConfigsComponent implements OnInit {

  configType: string;
  user: User;
  fields: Config[] = [];
  type: string;


  constructor(
    private routeTo: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private configService: ConfigService,
    private bannerService: BannerService,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.configType = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.configService.getConfigs(this.user.CompanyId);
    this.fields = this.configService.currentConfigValue;
    if (this.fields && this.fields.length) {

    } else {
      // create new banking details form
      this.createNewBankForm();
    }
  }

  populateFields(data) {
    this.fields.push(data);
  }
  abort() {
    this.routeTo.navigate([this.bannerService.currentBannerValue.backto]);
  }

  createNewBankForm() {
    this.fields = newBankArray(this.user.CompanyId);
  }
  getCurrentConfigType() {
    if (this.configType === 'bank-details') {
      this.type = 'bank';
    }
  }
}
