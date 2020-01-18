import { Component, OnInit } from '@angular/core';
import { UsersService, CompanyService, AccountService } from 'src/app/_services';
import { User, Company } from 'src/app/_models';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-company',
  templateUrl: './update-company.component.html',
  styleUrls: ['./update-company.component.scss']
})
export class UpdateCompanyComponent implements OnInit {
  user: User;
  company: Company;
  rForm: FormGroup;
  constructor(private fb: FormBuilder,
              private userService: UsersService,
              private accountService: AccountService,
              private messageService: MessageService,
              private routeTo: Router,
              private companyService: CompanyService) {

  }

  ngOnInit() {
    this.user = this.userService.currentUserValue;
    this.company = this.user.Company;
    this.rForm = this.fb.group({
      Name: [this.company.Name, Validators.required],
      TelephoneNumber: [this.company.TelephoneNumber, Validators.required],
      Website: [this.company.Website, Validators.required],
      CompanyId: [this.company.CompanyId, Validators.required],
      ModifyUserId: [this.user.UserId, Validators.required],
      StatusId: [this.company.StatusId]
    });

  }

  update(company: Company) {
    this.companyService.updateCompany(company).subscribe(response => {
      if (response) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success.',
          detail: `Company updated successfully`
        });
        this.companyService.updateState(response);
        this.company.Name = response.Name;
        this.company.Website = response.Website;
        this.company.TelephoneNumber = response.TelephoneNumber;
        this.user.Company = this.company;
        this.userService.updateUserState(this.user, 'user');
        this.accountService.updateUserState(this.user);
      }
    });
    this.routeTo.navigate(['/dashboard/profile'])

  }

}
