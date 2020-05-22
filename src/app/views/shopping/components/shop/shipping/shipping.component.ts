import { Component, OnInit } from '@angular/core';
import { Partner, User } from 'src/app/_models';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { AccountService, UsersService } from 'src/app/_services';

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

  customer: User;
  signUped = true;
  signUp;
  user: User;
  password: string;
  showLogin: any;
  shopPrimaryColor: string;
  shopSecondaryColor: string;
  constructor(
    private shoppingService: ShoppingService, private accountService: AccountService, private usersService: UsersService
  ) { }

  ngOnInit() {
    this.shoppingService.customer.subscribe(user => {
      if (user && user.UserId) {
        this.user = user;
        this.signUped = true;
      }
    });
    this.shoppingService.modalDone.subscribe(modal => {
      this.showLogin = modal;
    });
    this.shoppingService.company.subscribe(company => {
      console.log('company company', company);
      
      if (company && company.Theme) {
        this.shopPrimaryColor = company.Theme.find(x => x.Name === 'shopPrimaryColor').Value;
        this.shopSecondaryColor = company.Theme.find(x => x.Name === 'shopSecondaryColor').Value;
      }
    });
    if (!this.user) {
      this.signUped = false;
      this.shoppingService.customer.subscribe(state => {
        if (state) {
          this.customer = state;
          this.fullname = this.customer.Name;
          this.email = this.customer.Email;
          this.cell = this.customer.CellphoneNumber;
          this.address = this.customer.Address;
        }
      });
    } else {
      this.customer = {
        CompanyId: '',
        Name: this.user.Name || '',
        Surname: '',
        CellphoneNumber: this.user.CellphoneNumber || '',
        Email: this.user.Email || '',
        Password: '',
        Address: this.user.Address || '',
        CreateUserId: 'customer',
        ModifyUserId: 'customer',
        StatusId: '1'
      };
      this.fullname = this.customer.Name;
      this.email = this.customer.Email;
      this.cell = this.customer.CellphoneNumber;
      this.address = this.customer.Address;
    }


  }
  saveCustomerState() {
    if (!this.customer) {
      this.customer = {
        CompanyId: '',
        Name: '',
        Surname: '',
        CellphoneNumber: '',
        Email: '',
        Password: '',
        Address: '',
        CreateUserId: 'customer',
        ModifyUserId: 'customer',
        StatusId: '1'
      }
    }
    this.customer.Name = this.fullname;
    this.customer.Email = this.email;
    this.customer.CellphoneNumber = this.cell;
    this.customer.Address = this.address;
    this.customer.Password = this.password;
    this.shoppingService.updateCustomerState(this.customer);
  }

  addNewUser() {
    const data: User = {
      Email: this.customer.Email,
      Name: this.customer.Name,
      Surname: '',
      CellphoneNumber: this.customer.CellphoneNumber,
      Address: this.customer.Address,
      CompanyName: 'customer',
      Password: this.password,
      CreateUserId: 'web',
      ModifyUserId: 'web',
      RoleId: 3,
      StatusId: 1
    };
    if (this.signUp) {
      this.accountService.signUpCustomer(data).subscribe(user => {
        if (user && user.UserId) {
          this.shoppingService.updateCustomerState(user);
        }
      });
    }
    this.shoppingService.updateStepState(2);
  }

  toggleShowLogin() {
    this.showLogin = !this.showLogin;
    this.shoppingService.updateModalState(this.showLogin);
  }
}
