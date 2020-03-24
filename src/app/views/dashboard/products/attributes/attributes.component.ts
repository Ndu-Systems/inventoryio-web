import { Component, OnInit, Input } from '@angular/core';
import { Attribute, AttributeItem } from 'src/app/_models/Attribute.model';
import { User, Product } from 'src/app/_models';
import { AccountService, ProductService } from 'src/app/_services';
import { AttributeService } from 'src/app/_services/dashboard/attribute.service';
import { ConfirmationService, MessageService } from 'primeng/api';

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
  confirmDialogHeader = 'Confirm Delete Option';


  // the whole new thing now
  attributesToInit: Attribute[] = [];
  lockConfirmedMessage: boolean;

  constructor(
    private accountService: AccountService,
    private attributeService: AttributeService,
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,


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
            if (!this.attributesToInit.length) {
              this.initAttributes();
            }
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
        Id: item.AttributeValueId,
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
    if (!attributes) {
      attributes = [];
    }
    attributes.forEach(attribute => {
      if (attribute.Values) {
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
            AttributeValueId: value.Id,
          };
          mappedAttributes.push(data);
        });
      }
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
  removeItem(index: number) {
    const item = this.attributesToInit[index];
    const checkIfNameISAlreadyMaped = this.attributesToInit.filter(x => x.Name.toLocaleLowerCase() === item.Name.toLocaleLowerCase());
    if (checkIfNameISAlreadyMaped.length > 1) {
      item.AttributeId = '0';
    }
    this.confirmationService.confirm({
      message: `${item.Name} ${item.AttributeValue} will be removed , continue`,
      accept: () => {

        this.attributeService.deleteAttributeItem(item.AttributeValueId, item.AttributeId).subscribe(response => {
          console.log('response', response);
          this.attributesToInit.splice(index);
          console.log('checkIfNameISAlreadyMaped', checkIfNameISAlreadyMaped);
          console.log(index, item);

          this.messageService.add({
            severity: 'success',
            summary: `${item.AttributeValue} Item deleted!`,
            life: 9000,
            detail: `${item.Name} ${item.AttributeValue} will be removed, please remember to press save button, when you done, thank you`
          });
          this.lockConfirmedMessage = true;
          this.confirmOptions();
          this.lockConfirmedMessage = false;

        });
      }
    });

    return true;

  }

  confirmOptions() {
    this.attributes = [];
    this.attributesToInit.forEach(item => {
      const optionsName = item.Name.toLocaleLowerCase();
      const checkIfNameISAlreadyMaped = this.attributes.find(x => x.Name.toLocaleLowerCase() === optionsName);
      if (!checkIfNameISAlreadyMaped) {
        // find me all attributes of the same name . eg find me : Size = [S,M,L]
        const allValues: any[] = this.attributesToInit.filter(x => x.Name.toLocaleLowerCase() === optionsName).map(x => {
          return {
            AttributeValue: x.AttributeValue,
            AttributeQuantity: x.AttributePrice,
            AttributePrice: x.AttributeQuantity,
            AttributeValueId: x.AttributeValueId || 0,
          };
        });
        const data: Attribute = {
          AttributeId: item.AttributeId,
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
    if (!this.lockConfirmedMessage) {
      this.messageService.add({
        severity: 'success',
        summary: 'Option Confirmed',
        detail: `Please remember to press save button, when you done, thank you.`
      });
    }

    this.attributeService.updateState(this.attributes);
  }

}
