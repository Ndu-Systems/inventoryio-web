import { Component, OnInit, Input } from '@angular/core';
import { Attribute, AttributeItem } from 'src/app/_models/Attribute.model';
import { User, Product } from 'src/app/_models';
import { AccountService, ProductService } from 'src/app/_services';
import { AttributeService } from 'src/app/_services/dashboard/attribute.service';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit {
  @Input() id = '';
  displayModal: boolean;
  options: string[] = [];
  optionsName: string;
  // attributes: any[] = [];
  attributes: Attribute[] = [];
  user: User;

  product: Product;


  // the whole new thing now
  attributesToInit: Attribute[] = [];

  constructor(
    private accountService: AccountService,
    private attributeService: AttributeService,
    private productService: ProductService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.id.length > 8) {
      this.productService.products.subscribe(data => {
        if (data && data.length) {
          this.product = data.find(x => x.ProductId === this.id);
          if (this.product) {
            this.attributes = this.product.Attributes || [];
          }
        }
      });
    }
    //  the whole new thing now
    this.initAttributes();
  }
  showModalDialog() {
    this.displayModal = true;
  }

  saveOptions() {

    const data: Attribute = {
      Name: this.optionsName,
      AttributeType: 'text',
      CompanyId: this.user.CompanyId,
      ProductId: this.id,
      Shop: 1,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
      Values: this.mapAttributeItems(this.options)
    };
    this.attributes.push(data);
    console.log(this.attributes);
    this.attributeService.updateState(this.attributes);
  }

  mapAttributeItems(options: string[]): AttributeItem[] {
    const values: AttributeItem[] = [];
    options.forEach(item => {
      values.push({
        AttributeValue: item,
        AttributePrice: null,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1
      });
    });
    return values;
  }

  // the whole new thing now

  initAttributes() {
    const data: Attribute = {
      AttributeId: `${new Date().getTime() + Math.ceil(Math.random() * 1000)}`,
      Name: '',
      AttributeType: 'text',
      CompanyId: this.user.CompanyId,
      ProductId: this.id,
      Shop: 1,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
      Values: [],
      AttributeValue: '',
      AttributeQuantity: '',
      AttributePrice: '',
    };
    this.attributesToInit.push(data);
  }

  copyDown(item: Attribute) {
    const newItem = item;
    const data: Attribute = {
      AttributeId: `${new Date().getTime() + Math.ceil(Math.random() / 100000)}`,
      Name: item.Name,
      AttributeType: 'text',
      CompanyId: this.user.CompanyId,
      ProductId: this.id,
      Shop: 1,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
      Values: [],
      AttributeValue: '',
      AttributeQuantity: item.AttributeQuantity,
      AttributePrice: item.AttributePrice,
    };
    this.attributesToInit.push(data);
    console.log(this.attributesToInit);

  }
  removeItem(item: Attribute) {
    if (this.attributesToInit.length <= 1) {
      return;
    }
    const index = this.attributesToInit.indexOf(this.attributesToInit.find(x => x.AttributeId === item.AttributeId));
    this.attributesToInit.splice(index);
  }

  confirmOptions() {

    this.attributesToInit.forEach(item => {
      const optionsName = item.Name;
    });
    const data: Attribute = {
      Name: this.optionsName,
      AttributeType: 'text',
      CompanyId: this.user.CompanyId,
      ProductId: this.id,
      Shop: 1,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
      Values: this.mapAttributeItems(this.options)
    };
    this.attributes.push(data);
    console.log(this.attributes);
    this.attributeService.updateState(this.attributes);
  }

}
