import { Component, OnInit } from '@angular/core';
import { UsersService, ProductService } from 'src/app/_services';
import { User } from 'src/app/_models';

@Component({
  selector: 'app-veli-dashboard-help',
  templateUrl: './veli-dashboard-help.component.html',
  styleUrls: ['./veli-dashboard-help.component.scss']
})
export class VeliDashboardHelpComponent implements OnInit {
  heading = '';
  user: User;
  details: string;
  linklabel: string;
  link: string;
  display: boolean;
  canShow = true;
  constructor(
    private usersService: UsersService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.user = this.usersService.currentUserValue;
    this.heading = `Hey ${this.user.Name}👋, I am glad you are here!`;
    this.details = `I am here to help you to oversee your inventory, but I will need you to add some products first.`;
    this.linklabel = 'Add product';
    this.link = `add-product`;

    this.productService.products.subscribe(products => {
      if (products.length === 0 && this.canShow) {
        this.display = true;
      }else{
        this.display = false;
      }
    });
  }
  hide() {
    this.display = false;
    this.canShow = false;
  }

}
