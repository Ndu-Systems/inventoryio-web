import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shopping-nav',
  templateUrl: './shopping-nav.component.html',
  styleUrls: ['./shopping-nav.component.scss']
})
export class ShoppingNavComponent implements OnInit {
  showMobileNav: boolean;
  @Input() shopPrimaryColor = '#104CE5';
  @Input() shopSecondaryColor = '#ffffff';

  constructor() { }

  ngOnInit() {
  }
  toggleNav() {
    this.showMobileNav = !this.showMobileNav;
  }
}
