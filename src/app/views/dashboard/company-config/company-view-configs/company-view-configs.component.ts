import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, BannerService } from 'src/app/_services';
import { User } from 'src/app/_models';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Config } from 'src/app/_models/Config';

@Component({
  selector: 'app-company-view-configs',
  templateUrl: './company-view-configs.component.html',
  styleUrls: ['./company-view-configs.component.scss']
})
export class CompanyViewConfigsComponent implements OnInit {

  configType: string;
  rForm: FormGroup;
  user: User;
  fields: Config[] = [];


  constructor(
    private routeTo: Router,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private bannerService: BannerService,
    private fb: FormBuilder,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.configType = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.populateFields();

  }

  populateFields() {
    const data = {
      CompanyId: this.user.CompanyId,
      Name: 'dddddd',
      Label: 'BANK NAME',
      Value: 'FNB',
      CreateUserId: 'dddddd',
      ModifyUserId: 'dddddd',
      StatusId: 'dddddd'
    };
    this.fields.push(data,data);
  }
  abort() {
    this.routeTo.navigate([this.bannerService.currentBannerValue.backto]);
  }

}
