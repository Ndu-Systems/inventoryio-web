import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, Caterory } from 'src/app/_models';
import { CateroryService, AccountService } from 'src/app/_services';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
  rForm: FormGroup;
  category: Caterory;
  user: User;
  constructor(
    private fb: FormBuilder,
    private categoryService: CateroryService,
    private accountService: AccountService,
    private messageService: MessageService,
    private routeTo: Router
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.categoryService.category.subscribe(category => {
      if (category) {
        this.category = category;
        this.initForm();
      }
    });
  }

  initForm() {
    this.rForm = this.fb.group({
      CatergoryId: [this.category.CatergoryId],
      Name: [this.category.Name, Validators.required],
      CompanyId: [this.category.CompanyId, Validators.required],
      CreateUserId: [this.category.CreateUserId, Validators.required],
      ModifyUserId: [this.user.UserId, Validators.required],
      StatusId: [this.category.StatusId, Validators.required]
    });
  }

  update(category: Caterory) {
    this.categoryService.updateCategory(category);
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'Category updated'
    });
    this.categoryService.removeCurrentCategory();
    this.routeTo.navigate(['/dashboard/list-categories'])
  }

}
