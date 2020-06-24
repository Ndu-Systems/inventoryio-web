import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User, Role, Partner } from 'src/app/_models';
import { BannerService, PartnerService, AccountService, RolesService } from 'src/app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { StatusConstant } from '../../shared';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-edit-partner',
  templateUrl: './edit-partner.component.html',
  styleUrls: ['./edit-partner.component.scss']
})
export class EditPartnerComponent implements OnInit {

  type: string;
  partnerType = 'customer';
  rForm: FormGroup;
  userAdded: User;
  roles: Role[];
  parnerId: string;
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
      this.parnerId = r.id;
      this.partnerService.getPartner(this.parnerId).subscribe(partner => {
        if (partner) {
          this.partnerType = partner.PartnerType;
          const user: User = this.accountService.currentUserValue;
          this.getRoles(user.CompanyId);
          this.rForm = this.fb.group({
            PartnerId: [partner.PartnerId, Validators.required],
            Name: [partner.Name, Validators.required],
            EmailAddress: [partner.EmailAddress, Validators.required],
            CellphoneNumber: [partner.CellphoneNumber, Validators.required],
            Surname: [partner.Surname],
            Password: [''],
            Address: [partner.Address],
            PartnerType: [partner.PartnerType],
            CompanyId: [user.CompanyId, Validators.required],
            CreateUserId: [user.UserId, Validators.required],
            ModifyUserId: [user.UserId, Validators.required],
            StatusId: [partner.StatusId, Validators.required]
          });
        }
      });

    });
  }

  ngOnInit() {



  }
  getRoles(companyId: string) {
    this.roleService.getRolesForCompany(companyId, StatusConstant.ACTIVE_STATUS)
      .subscribe(response => {
        this.roles = response;
      });
  }
  onSubmit(partner: Partner) {
    this.partnerService.updatePartner(partner);
    this.messageService.add({
      severity: 'success',
      summary: 'Success.',
      detail: `${this.partnerType} ${partner.Name} updated successfully`
    });
    this.routeTo.navigate([this.bannerService.currentBannerValue.backto]);
  }

  abort() {
    this.routeTo.navigate([this.bannerService.currentBannerValue.backto]);
  }

}
