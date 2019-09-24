import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Company, User, Role } from 'src/app/_models';
import { CompanyService, AccountService, RolesService } from 'src/app/_services';

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
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private companyService: CompanyService,
    private accountService: AccountService,
    private rolesService: RolesService,
  ) {
  }

  ngOnInit() {

    const user: User = this.accountService.currentUserValue;
    if (!user) {
      this.routeTo.navigate(['sign-in']);
    }
    this.rForm = this.fb.group({
      Name: ['', Validators.required],
      Address: ['', Validators.required],
      Website: [''],
      TelephoneNumber: ['', Validators.required],
      CreateUserId: [user.UserId, Validators.required],
      StatusId: [1, Validators.required],
      ModifyUserId: [user.UserId, Validators.required],
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
  }

  createRoles() {

  }

}
