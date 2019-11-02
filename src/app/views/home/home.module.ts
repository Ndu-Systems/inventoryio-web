import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule, declarations } from './home-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastModule } from 'primeng/toast';



@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule, ReactiveFormsModule

  ],
  declarations: [...declarations],
})
export class HomeModule {

  constructor() { }

  toggleNav() {
  }
}
