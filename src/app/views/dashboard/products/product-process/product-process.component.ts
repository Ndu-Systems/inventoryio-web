import { Component, OnInit } from '@angular/core';
import { Product, User } from 'src/app/_models';
import { ProductService, AccountService } from 'src/app/_services';
import { Productprocess, defoultProductprocesses } from 'src/app/_models/productproces.model';

@Component({
  selector: 'app-product-process',
  templateUrl: './product-process.component.html',
  styleUrls: ['./product-process.component.scss']
})
export class ProductProcessComponent implements OnInit {

  headings: string[] = [];
  product: Product;
  viewImage: boolean;
  currentImage: any;
  currentItem: Productprocess;
  currentIndex: number;
  currentImageName: string;
  deletedItems: Productprocess[] = [];
  user: User;
  constructor(
    private productService: ProductService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.productService.product.subscribe(data => {
      if (data) {
        this.product = data;
        if (!this.product.Productprocesses.length || this.product.Productprocesses[0].Id.length === 0) {
          this.product.Productprocesses = defoultProductprocesses;
        }
      }
    });



    this.headings.push(
      'Process name',
      'Notify customer',
      'Customer message',
      ''
    );

    this.user = this.accountService.currentUserValue;
  }

  addLine() {
    const item: Productprocess = {
      Id: '',
      ProductId: '',
      CompanyId: '',
      ProcessName: '',
      Started: '',
      AssignedUser: '',
      StartDatetime: '',
      FinishDatetime: '',
      NotifyCustomer: false,
      NotifyMessage: '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
    this.product.Productprocesses.push(item);
  }
  saveState() {
    this.productService.updateCurrentProduct(this.product);
  }

  removeLine(index) {
    if (this.product.Productprocesses[index].Id && this.product.Productprocesses[index].Id.length > 10) {
      this.product.Productprocesses[index].StatusId = 2;
    } else {
      this.product.Productprocesses.splice(index, 1);
    }
    if (!this.product.Productprocesses.length) {
      this.addLine();
    }
    return true;
  }


}
