import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, BannerService } from 'src/app/_services';
import { User } from 'src/app/_models';
import { Config, newBankArray, newAddressArray } from 'src/app/_models/Config';
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
    this.getCurrentConfigType();
    this.initScreen();

  }
  initScreen() {
    if (this.fields && this.fields.length) {
      this.fields = this.fields.filter(x => x.Type === this.type);
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
  }
  getCurrentConfigType() {
    if (this.configType === 'bank-details') {
      this.type = 'bank';
    }
    if (this.configType === 'address-details') {
      this.type = 'address';
    }
    if (this.configType === 'logo-and-colors') {
      this.type = 'logocolors';
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
}
