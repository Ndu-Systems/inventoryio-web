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

  items = [
    { AttributeValue: 'L' },
    { AttributeValue: 'S' },
    { AttributeValue: 'M' },
  ]
  product: Product;

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
            debugger
            this.attributes = this.product.Attributes || [];
          }
        }
      });
    }
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

}
