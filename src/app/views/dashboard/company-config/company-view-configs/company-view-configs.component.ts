import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, BannerService, CompanyConfigsService } from 'src/app/_services';
import { User, UserActions } from 'src/app/_models';
import { Config, newBankArray, newAddressArray } from 'src/app/_models/Config';
import { ConfigService } from 'src/app/_services/dashboard/config.service';
import { Observable } from 'rxjs';

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
  invoices: UserActions[] = [];
  fields$: Observable<Config[]>;
  lebel: string;
  backgroundColor = '#bdc3c7';
  fontColor = '#000000';


  constructor(
    private routeTo: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private configService: ConfigService,
    private bannerService: BannerService,
    private companyConfigsService: CompanyConfigsService,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.configType = r.id;
      this.user = this.accountService.currentUserValue;
      this.configService.getConfigs(this.user.CompanyId);
      this.fields = this.configService.currentConfigValue;
      this.getCurrentConfigType();
      this.initScreen();
      this.pupulateTabls();
      this.fields$ = this.companyConfigsService.feilds;
    });
  }

  ngOnInit() {

  }
  initScreen() {
    if (this.fields && this.fields.length) {
      this.fields = this.fields.filter(x => x.Type === this.type);
      this.companyConfigsService.updateState(this.fields);
      if (!this.fields.length) {
        this.createNewForm();
      }
    } else {
      this.createNewForm();
    }
  }
  populateFields(data) {
    this.fields.push(data);
  }
  abort() {
    this.routeTo.navigate([this.bannerService.currentBannerValue.backto]);
  }

  createNewForm() {
    if (this.type === 'bank') {
      this.fields = newBankArray(this.user.CompanyId);

    }
    if (this.type === 'address') {
      this.fields = newAddressArray(this.user.CompanyId);
    }
    this.companyConfigsService.updateState(this.fields);
  }
  getCurrentConfigType() {
    if (this.configType === 'bank-details') {
      this.type = 'bank';
      this.lebel = 'Banking Details';


    }
    if (this.configType === 'address-details') {
      this.type = 'address';
      this.lebel = 'Address Details';

    }
    if (this.configType === 'logo-and-colors') {
      this.type = 'logocolors';
      this.lebel = 'Invoice Logo';
    }
  }
  onSave() {
    if (this.isConfigValidToPost(this.fields)) {
      if (this.isNewConfigs(this.fields)) {
        this.postConfigs(this.fields);
      } else {
        this.updateConfigs(this.fields);
      }
    }
  }
  isConfigValidToPost(configs: Config[]) {
    return configs.filter(x => x.IsRequired && x.Value.trim() === '').length === 0;
  }
  isNewConfigs(configs: Config[]) {
    return configs.filter(x => x.ConfigId.length > 0).length === 0;
  }
  postConfigs(configs: Config[]) {
    alert('posting');
    this.configService.addConfigsRange(configs);
  }
  updateConfigs(configs: Config[]) {
    alert('updating');
    this.configService.updateConfigsRange(configs);
  }

  pupulateTabls() {
    this.invoices = [];
    this.invoices.push({
      name: 'banking details',
      image: 'assets/images/actions/save-money.svg',
      imageInverse: 'assets/images/actions/white-save-money.svg',
      link: 'dashboard/company-view-configs/bank-details',
      active: this.getActiveTab('dashboard/company-view-configs/bank-details')
    },
      {
        name: 'address details',
        image: 'assets/images/actions/companyaddress.svg',
        imageInverse: 'assets/images/actions/white-companyaddress.svg',
        link: 'dashboard/company-view-configs/address-details',
        active: this.getActiveTab('dashboard/company-view-configs/address-details')
      },
      {
        name: 'Logo and colors',
        image: 'assets/images/actions/logo-and-colors.svg',
        imageInverse: 'assets/images/actions/white-logo-and-colors.svg',
        link: 'dashboard/company-view-configs/logo-and-colors',
        active: this.getActiveTab('dashboard/company-view-configs/logo-and-colors')
      }
    );
  }
  getActiveTab(name: string) {
    return name.includes(this.configType);
  }
}
