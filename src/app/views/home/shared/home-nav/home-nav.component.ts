import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NavModuleServiceService } from 'src/app/_services';


@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {
  showMobileNav;
  showModules;
  modulesClass: any;
  showMenu: boolean;

  constructor(
    private routeTo: Router,
    private navService: NavModuleServiceService
  ) { }

  ngOnInit() {
  }
  toggleNav() {
    this.showMobileNav = !this.showMobileNav;
  }
  showModule() {
    this.showModules = !this.showModules;
    // if (this.showModules) {
    //   this.modulesClass = 'active-link';
    // }
    localStorage.setItem('Key', null);
  }
  closeModule() {
    if (this.closeModule) {
      this.showModules = false;
      this.showMobileNav = false;
    }
  }

  selectedModule(key) {
    this.navService.changeNav(key);
    this.routeTo.navigate(['/modules']);
    this.closeModule();
    this.showMenu = !this.showMenu;
  }
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
