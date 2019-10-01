import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Company, User, Role, Splash } from 'src/app/_models';
import { CompanyService, AccountService, RolesService, BannerService } from 'src/app/_services';
import { MessageService } from 'primeng/api';
import { SplashService } from 'src/app/_services/splash.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {
  heading = 'Add company';
  backto = '/dashboard';


  rForm: FormGroup;
  error: string;

  roles: Role[];
  user: User;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private companyService: CompanyService,
    private accountService: AccountService,
    private rolesService: RolesService,
    private bannerService: BannerService,
    private messageService: MessageService,
    private splashService: SplashService,
  ) {
  }

  ngOnInit() {

    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.routeTo.navigate(['sign-in']);
    }
    this.showWelcome();
    this.rForm = this.fb.group({
      Name: ['', Validators.required],
      Address: ['', Validators.required],
      Website: [''],
      TelephoneNumber: ['', Validators.required],
      CreateUserId: [this.user.UserId, Validators.required],
      StatusId: [1, Validators.required],
      ModifyUserId: [this.user.UserId, Validators.required],
    }
    );

    // update user
    this.companyService.currentCompany.subscribe(data => {
      if (data) {
        this.addCompanyTo();
        // this.rolesService.getRoles(data.CompanyId);
      }
    });

    // get roles
    // this.rolesService.currentRole.subscribe(data => {
    //   this.roles = data;
    // });

    this.bannerService.updateState({
      heading: 'Add Your Company',
      backto: '/dashboard'
    });
  }
  get getFormValues() {
    return this.rForm.controls;
  }
  add(company: Company) {
    console.log(company);
    this.companyService.addCompany(company);
  }

  addCompanyTo() {
    const user = this.accountService.currentUserValue;
    const currentCompany = this.companyService.currentCompanyValue;
    if (!user.CompanyId) {
      user.CompanyId = currentCompany.CompanyId;
      this.accountService.updateUser(user);
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'brand  created '
    });
    this.routeTo.navigate(['/dashboard/add-product']);
  }

  createRoles() {

  }

  showWelcome() {
    const message: Splash = {
      heading: `Hey ${this.user.Name}, Welcome to inventory-io!`,
      message: `One more step, please give us your company details`,
      show: true,
      class: 'success',
    };
    this.splashService.update(message);
  }

}
