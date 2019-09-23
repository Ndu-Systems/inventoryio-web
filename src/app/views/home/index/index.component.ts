import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {
  showMobileNav
  constructor() { }

  ngOnInit() {
  }
  toggleNav(){
    this.showMobileNav = !this.showMobileNav
  }
}
