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
            this.attributesToInit = this.mapAttributesForInit(this.attributes);
          }
        }
      });
    } else {
      this.initAttributes();
    }
  }


  mapAttributeItems(options: any[]): AttributeItem[] {
    const values: AttributeItem[] = [];
    options.forEach(item => {
      values.push({
        AttributeValue: item.AttributeValue,
        AttributePrice: item.AttributePrice,
        AttributeQuantity: item.AttributeQuantity,
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

  mapAttributesForInit(attributes: Attribute[]) {
    const mappedAttributes: Attribute[] = [];
    attributes.forEach(attribute => {
      attribute.Values.forEach(value => {
        const data: Attribute = {
          AttributeId: attribute.AttributeId,
          Name: attribute.Name,
          AttributeType: 'text',
          CompanyId: this.user.CompanyId,
          ProductId: this.id,
          Shop: 1,
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: 1,
          Values: [],
          AttributeValue: value.AttributeValue,
          AttributeQuantity: value.AttributeQuantity,
          AttributePrice: value.AttributePrice,
        };
        mappedAttributes.push(data);
      });
    });
    return mappedAttributes;
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
    this.attributes = [];
    this.attributesToInit.forEach(item => {
      const optionsName = item.Name;
      const checkIfNameISAlreadyMaped = this.attributes.find(x => x.Name === optionsName);
      if (!checkIfNameISAlreadyMaped) {
        // find me all attributes of the same name . eg find me : Size = [S,M,L]
        const allValues: any[] = this.attributesToInit.filter(x => x.Name === optionsName).map(x => {
          return {
            AttributeValue: x.AttributeValue,
            AttributeQuantity: x.AttributePrice,
            AttributePrice: x.AttributeQuantity,
          };
        });
        const data: Attribute = {
          Name: optionsName,
          AttributeType: 'text',
          CompanyId: this.user.CompanyId,
          ProductId: this.id,
          Shop: 1,
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: 1,
          Values: this.mapAttributeItems(allValues)
        };
        this.attributes.push(data);
      }
    });

    console.log(this.attributes);
    this.attributeService.updateState(this.attributes);
  }

}
