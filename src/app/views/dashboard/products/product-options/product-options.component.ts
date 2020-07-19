import { Component, OnInit, Input } from '@angular/core';
import { Productoptions, defaultOptions } from 'src/app/_models/productoptions.model';
import { ProductService, DocumentsService } from 'src/app/_services';
import { Product } from 'src/app/_models';
import { url } from 'inspector';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-options',
  templateUrl: './product-options.component.html',
  styleUrls: ['./product-options.component.scss']
})
export class ProductOptionsComponent implements OnInit {
  headings: string[] = [];
  product: Product;
  viewImage: boolean;
  currentImage: any;
  currentItem: Productoptions;
  currentIndex: number;
  currentImageName: string;
  constructor(private productService: ProductService, private documentsService: DocumentsService) { }

  ngOnInit() {
    this.productService.product.subscribe(data => {
      if (data) {
        this.product = data;
        if (!this.product.Productoptions.length) {
          this.product.Productoptions = defaultOptions;
        }
      }
    });

    this.headings.push(
      'Size',
      'Colour',
      'Quantity',
      'Image',
      ''
    );
  }

  addLine() {
    const item = {
      Id: new Date().getTime().toString(),
      ProductId: '',
      CompanyId: '',
      Name1: 'Size',
      Name2: 'Colour',
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
      Quantity: null,
      CreateUserId: '',
      ModifyUserId: '',
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
            Name1: 'Size',
            Name2: 'Colour',
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
            Quantity: null,
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
    alert(index);
    this.product.Productoptions.splice(index);
  }
}
