import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, BannerService, CompanyConfigsService } from 'src/app/_services';
import { User, UserActions } from 'src/app/_models';
import { Config, newBankArray, newAddressArray, newColorsArray } from 'src/app/_models/Config';
import { ConfigService } from 'src/app/_services/dashboard/config.service';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

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
  shopPrimaryColor = '#104CE5';
  shopSecondaryColor = '#ffffff';
  fontColor = '#000000';
  valid = false;


  constructor(
    private routeTo: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private configService: ConfigService,
    private bannerService: BannerService,
    private companyConfigsService: CompanyConfigsService,
    private messageService: MessageService,

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
      console.log(this.fields);
      if (this.type === 'logocolors' && this.fields.length) {
        this.backgroundColor = this.rgb2hex(this.fields[0].Value);
        this.fontColor = this.rgb2hex(this.fields[1].Value);
      }
      if (this.configType === 'shop' && this.fields.length) {
        this.shopPrimaryColor = this.fields.find(x => x.Name === 'shopPrimaryColor').Value;
        this.shopSecondaryColor = this.fields.find(x => x.Name === 'shopSecondaryColor').Value;
        this.fontColor = this.rgb2hex(this.fields[1].Value);
      }

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
    if (this.type === 'logocolors') {
      this.fields = newColorsArray(this.user.CompanyId);
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
    if (this.configType === 'shop') {
      this.type = 'shop';
      this.lebel = 'Upload Cover Image';
    }
  }
  onSave() {
    debugger
    if (this.isColorsConfig(this.fields)) {
      this.fields[0].Value = this.hexToRgbA(this.backgroundColor);
      this.fields[1].Value = this.hexToRgbA(this.fontColor);
    }
    if (this.isConfigValidToPost(this.fields)) {
      if (this.isNewConfigs(this.fields)) {
        this.postConfigs(this.fields);
      } else {
        this.updateConfigs(this.fields);
      }
    }
  }

  saveShopDetails() {
    const shopConfigs = [
      {
        ConfigId: '',
        CompanyId: this.user.CompanyId,
        Name: 'shopPrimaryColor',
        Label: 'Primary Color',
        Type: 'shop',
        Value: this.shopPrimaryColor,
        IsRequired: true,
        FieldType: 'string',
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1
      },
      {
        ConfigId: '',
        CompanyId: this.user.CompanyId,
        Name: 'shopSecondaryColor',
        Label: 'Secondary Color',
        Type: 'shop',
        Value: this.shopSecondaryColor,
        IsRequired: true,
        FieldType: 'string',
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1
      }
    ];

    if (this.isConfigValidToPost(shopConfigs)) {
      if (this.fields.length === 0) {
        this.postConfigs(shopConfigs);
      } else {
        shopConfigs[0].ConfigId = this.fields[0].ConfigId;
        shopConfigs[this.fields.indexOf(this.fields.find(x => x.Name === 'shopPrimaryColor'))].ConfigId =
          this.fields[this.fields.indexOf(this.fields.find(x => x.Name === 'shopPrimaryColor'))].ConfigId;

        shopConfigs[this.fields.indexOf(this.fields.find(x => x.Name === 'shopSecondaryColor'))].ConfigId =
          this.fields[this.fields.indexOf(this.fields.find(x => x.Name === 'shopSecondaryColor'))].ConfigId;
        this.updateConfigs(shopConfigs);
      }
    }

  }
  isConfigValidToPost(configs: Config[]) {
    return configs.filter(x => x.IsRequired && !x.Value).length === 0;
  }
  isNewConfigs(configs: Config[]) {
    return configs.filter(x => x.ConfigId.length > 0).length === 0;
  }
  isColorsConfig(configs: Config[]) {
    return configs.filter(x => x.Type === 'logocolors').length > 0;
  }
  postConfigs(configs: Config[]) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `${this.type} created successfully.`
    });
    this.configService.addConfigsRange(configs);
    this.configService.getConfigs(this.user.CompanyId);
    this.configService.configs.subscribe(data => {
      this.fields = data;
      this.fields = this.fields.filter(x => x.Type === this.type);

    })
  }
  updateConfigs(configs: Config[]) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `${this.type} updated successfully.`
    });
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
  hexToRgbA(hex) {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
    }
    throw new Error('Bad Hex');
  }
  rgb2hex(rgb) {
    rgb = `rgb(${rgb})`;
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? '#' +
      ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
  }
}
