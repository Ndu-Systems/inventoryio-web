import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User, Role, Partner } from 'src/app/_models';
import { BannerService, UsersService, AccountService, RolesService, PartnerService } from 'src/app/_services';
import { DEFAULT_PASSWORD, StatusConstant } from '../../shared';
import { MessageService } from 'primeng/api';
import { TopHeading } from 'src/app/_models/top-heading.model';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss']
})
export class AddPartnerComponent implements OnInit {
  type: string;
  partnerType: string;
  rForm: FormGroup;
  userAdded: User;
  roles: Role[];
  topHeading: TopHeading = {
    backto: '/dashboard/customers',
    heading: 'Create customer'
  };
  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService,
    private partnerService: PartnerService,
    private accountService: AccountService,
    private messageService: MessageService,
    private roleService: RolesService,
    private routeTo: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.type = r.id;
      this.partnerType = this.type.slice(0, -1);
    });
  }

  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    this.getRoles(user.CompanyId);
    this.rForm = this.fb.group({
      EmailAddress: ['', Validators.required],
      Name: [null, Validators.required],
      CellphoneNumber: ['', Validators.required],
      Surname: [''],
      Password: [''],
      Address: [''],
      PartnerType: [this.partnerType],
      CompanyId: [user.CompanyId, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [StatusConstant.ACTIVE_STATUS, Validators.required]
    });
  }
  getRoles(companyId: string) {
    this.roleService.getRolesForCompany(companyId, StatusConstant.ACTIVE_STATUS)
      .subscribe(response => {
        this.roles = response;
      });
  }
  onSubmit(partner: Partner) {
    this.partnerService.addPartner(partner);
    this.messageService.add({
      severity: 'success',
      summary: 'Success.',
      detail: `${this.partnerType} ${partner.Name} added successfully`
    });
    this.routeTo.navigate([this.bannerService.currentBannerValue.backto]);
  }

  abort() {
    this.routeTo.navigate([this.bannerService.currentBannerValue.backto]);
  }
}
