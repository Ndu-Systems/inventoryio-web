import { Component, OnInit } from '@angular/core';
import { Partner } from 'src/app/_models';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
  email;
  cell;
  fullname;
  address;

  customer: Partner;
  constructor(
    private shoppingService: ShoppingService
  ) { }

  ngOnInit() {
    this.customer = {
      PartnerId: '',
      CompanyId: '',
      PartnerType: 'customer',
      Name: '',
      Surname: '',
      CellphoneNumber: '',
      EmailAddress: '',
      Password: '',
      Address: '',
      CreateUserId: 'customer',
      ModifyUserId: 'customer',
      StatusId: '1'
    };
  }
  saveCustomerState() {
    this.customer.Name = this.fullname;
    this.customer.EmailAddress = this.email;
    this.customer.CellphoneNumber = this.cell;
    this.customer.Address = this.address;
    this.shoppingService.updateCustomerState(this.customer);
  }
}
