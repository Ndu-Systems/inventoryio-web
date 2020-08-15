import { Component, OnInit } from '@angular/core';
import { Product, User } from 'src/app/_models';
import { Productoptions, defaultOptions } from 'src/app/_models/productoptions.model';
import { ProductService, DocumentsService, AccountService } from 'src/app/_services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-option-make',
  templateUrl: './product-option-make.component.html',
  styleUrls: ['./product-option-make.component.scss']
})
export class ProductOptionMakeComponent implements OnInit {

  headings: string[] = [];
  product: Product;
  viewImage: boolean;
  currentImage: any;
  currentItem: Productoptions;
  currentIndex: number;
  currentImageName: string;
  deletedItems: Productoptions[] = [];
  user: User;
  constructor(
    private productService: ProductService,
    private documentsService: DocumentsService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.productService.product.subscribe(data => {
      if (data) {
        this.product = data;
        if (!this.product.Productoptions.length || this.product.Productoptions[0].Id.length === 0) {
          this.product.Productoptions = defaultOptions;
          this.product.Productoptions[0].Name1 = 'Color';
          this.product.Productoptions[0].Name2 = '';
          this.product.Productoptions[0].Quantity = 0;
        }
        // if (this.product.Productoptions[0].Id.length === 0) {

        // }
      }
    });



    this.headings.push(
      'Colour',
      'Image',
      ''
    );

    this.user = this.accountService.currentUserValue;
  }

  addLine() {
    const item = {
      Id: '',
      ProductId: '',
      CompanyId: '',
      Name1: 'Colour',
      Name2: '',
      Name3: '',
      Name4: '',
      Name5: '',
      Value1: '',
      Value2: '',
      Value3: '',
      Value4: '',
      Value5: '',
      ImageUrl1: '',
      ImageUrl2: '',
      ImageUrl3: '',
      Quantity: 0,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
    this.product.Productoptions.push(item);
  }
  saveState() {
    this.productService.updateCurrentProduct(this.product);
  }

  imageChanged(id, event, index, inputNumber) {
    // console.log(event);
    const files = event.target.files;
    console.log(files);
    this.uplaodFile(files, index, inputNumber);

  }


  uplaodFile(files: FileList, index: number, inputNumber) {
    if (!files.length) {
      return false;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.documentsService.uploadFile(formData).subscribe(url => {
        // this.saveImage(url);
        if (this.product.Productoptions.length === 0) {
          this.product.Productoptions[0] = {
            Id: new Date().getTime().toString(),
            ProductId: '',
            CompanyId: '',
            Name1: 'Colour',
            Name2: '',
            Name3: '',
            Name4: '',
            Name5: '',
            Value1: '',
            Value2: '',
            Value3: '',
            Value4: '',
            Value5: '',
            ImageUrl1: '',
            ImageUrl2: '',
            ImageUrl3: '',
            Quantity: 0,
            CreateUserId: '',
            ModifyUserId: '',
            StatusId: 1
          };
        }
        if (inputNumber === 1) {
          this.product.Productoptions[index].ImageUrl1 = `${environment.API_URL}/api/upload/${url}`;
        }
        if (inputNumber === 2) {
          this.product.Productoptions[index].ImageUrl2 = `${environment.API_URL}/api/upload/${url}`;
        }
        if (inputNumber === 3) {
          this.product.Productoptions[index].ImageUrl3 = `${environment.API_URL}/api/upload/${url}`;
        }
        console.log(url);
      });

    });

  }
  showImage(item: Productoptions, imageUrl, imageName: string, index: number) {
    this.viewImage = true;
    this.currentImage = imageUrl;
    this.currentItem = item;
    this.currentIndex = index;
    this.currentImageName = imageName;
  }
  deleteImage() {
    if (this.currentItem && this.currentIndex >= 0
    ) {
      if (this.currentImageName === 'ImageUrl1') {
        this.product.Productoptions[this.currentIndex].ImageUrl1 = null;
      }
      if (this.currentImageName === 'ImageUrl2') {
        this.product.Productoptions[this.currentIndex].ImageUrl2 = null;
      }
      if (this.currentImageName === 'ImageUrl3') {
        this.product.Productoptions[this.currentIndex].ImageUrl3 = null;
      }
      this.saveState();
      this.closeImage();
    }
  }
  closeImage() {
    this.viewImage = false;
    this.currentImage = undefined;
    this.currentItem = undefined;
    this.currentIndex = undefined;
    this.currentImageName = undefined;
  }
  removeLine(index) {
    if (this.product.Productoptions[index].Id && this.product.Productoptions[index].Id.length > 10) {
      this.product.Productoptions[index].StatusId = 2;
    } else {
      this.product.Productoptions.splice(index, 1);
    }
    if (!this.product.Productoptions.length) {
      this.addLine();
    }
    return true;
  }

}
