import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Brand, Caterory, User, Product, Banner } from 'src/app/_models';
import { Router } from '@angular/router';
import { AccountService, ProductService, BrandService, CateroryService, BannerService, DocumentsService } from 'src/app/_services';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-catergory',
  templateUrl: './add-catergory.component.html',
  styleUrls: ['./add-catergory.component.scss']
})
export class AddCatergoryComponent implements OnInit, OnDestroy {
  @Output() showForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  rForm: FormGroup;
  error: string;
  brands$: Observable<Brand[]>;
  catergories$: Observable<Caterory[]>;
  banner: Banner;
  imageUrl: string;
  category: Caterory;
  isUpdate: boolean;
  actionLabel = 'Add category';
  heading = ' Add a new category';
  viewImage: boolean;
  parentCategories: Caterory[] = [];
  type: string;
  parent: string;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private cateroryService: CateroryService,
    private messageService: MessageService,
    private bannerService: BannerService,
    private documentsService: DocumentsService,
  ) {

  }


  ngOnInit() {
    const user: User = this.accountService.currentUserValue;
    const addType = this.cateroryService.getCateroryAddType;
    this.heading = `Add a new ${addType.nextType} category`;
    if (addType.nextType === 'child') {
      this.heading = `Add a new  ${addType.nextType} for ${addType.nextParentName}  category`;
    }
    this.accountService.checkSession();
    this.banner = this.bannerService.currentBannerValue;
    this.cateroryService.getCateries(user.CompanyId);
    this.cateroryService.categories.subscribe(data => {
      if (data && data.length) {
        this.parentCategories = data.filter(x => x.CatergoryType === 'parent');
      }
    });

    this.cateroryService.category.subscribe(category => {
      if (category) {
        this.category = category;
        this.imageUrl = this.category.ImageUrl;
        if (this.category.CatergoryId.length > 5) {
          this.isUpdate = true;
          this.actionLabel = 'Update category';
          this.heading = 'Update a category';
        }
      }
      this.rForm = this.fb.group({
        Name: [this.category && this.category.Name || '', Validators.required],
        Description: [this.category && this.category.Description || ''],
        Parent: [this.category && this.category.Parent || addType.nextParentId],
        CatergoryType: [this.category && this.category.CatergoryType || addType.nextType],
        CompanyId: [user.CompanyId, Validators.required],
        CreateUserId: [user.UserId, Validators.required],
        StatusId: [this.category && this.category.StatusId || 1, Validators.required],
        ModifyUserId: [user.UserId, Validators.required],
      });
    });

  }

  ngOnDestroy(): void {
    this.cateroryService.updateCurrentCategory(null);
  }

  add(caterory: Caterory) {
    caterory.ImageUrl = this.imageUrl || '';
    if (this.isUpdate) {
      caterory.CatergoryId = this.category.CatergoryId;
      this.cateroryService.updateCategory(caterory);
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'catergory  updated '
      });
    } else {
      this.cateroryService.addCaterory(caterory);
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'catergory  created '
      });
    }

    this.routeTo.navigate([this.banner.backto]);
  }

  cancel() {
    this.routeTo.navigate([this.banner.backto]);
  }
  imageChanged(event) {
    const files = event.target.files;
    console.log(files);
    this.uplaodFile(files);

  }


  uplaodFile(files: FileList) {
    if (!files.length) {
      return false;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.documentsService.uploadFile(formData).subscribe(url => {
        this.imageUrl = `${environment.API_URL}/api/upload/${url}`;
      });

    });

  }
  showImage() {
    this.viewImage = true;
  }

  deleteImage() {
    this.imageUrl = undefined;
    this.viewImage = false;
  }
  closeImage() {
    this.viewImage = false;
  }

}
