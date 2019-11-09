import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User, Role, Partner } from 'src/app/_models';
import { BannerService, UsersService, AccountService, RolesService, PartnerService } from 'src/app/_services';
import { DEFAULT_PASSWORD, StatusConstant } from '../../shared';
import { MessageService } from 'primeng/api';

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
      EmailAddress: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      Name: [null, Validators.required],
      CellphoneNumber: [null, Validators.required],
      Surname: [''],
      Password: [''],
      Address: [''],
      PartnerType: [this.partnerType],
      CompanyId: [user.CompanyId, Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
      StatusId: [StatusConstant.ACTIVE_STATUS, Validators.required]
    });
    this.bannerService.updateState({
      heading: 'Add a user',
      backto: '/dashboard/users'
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
      detail: `User ${partner.Name} added successfully`
    });
    //  this.routeTo.navigate(['dashboard/users']);
    //this.showForm.emit(false);
  }


}
