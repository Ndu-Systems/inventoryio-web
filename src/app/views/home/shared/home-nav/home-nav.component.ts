import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {
  showMobileNav;

  constructor() { }

  ngOnInit() {
  }
  toggleNav() {
    this.showMobileNav = !this.showMobileNav;
  }
}
