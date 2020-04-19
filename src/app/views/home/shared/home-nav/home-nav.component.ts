import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {

  showMobileNav;
  showModules;

  constructor(
    private routeTo: Router
  ) { }

  ngOnInit() {
  }
  toggleNav() {
    this.showMobileNav = !this.showMobileNav;
  }
  showModule() {
    this.showModules = !this.showModules;
    localStorage.setItem('Key', null);
  }
  closeModule() {
    if (this.closeModule) {
      this.showModules = false;
    }
  }
  selectedModule(key) {
    localStorage.setItem('Key', key);
    this.routeTo.navigate(['/modules']);
    this.closeModule();
  }
}
