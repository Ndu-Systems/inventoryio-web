import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule, declarations } from './home-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {GalleriaModule} from 'primeng/galleria';
import { ToastModule } from 'primeng/toast';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';



@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule, ReactiveFormsModule,
    GalleriaModule,
    CardModule,
    CarouselModule
  ],
  declarations: [
    ...declarations
  ],
})
export class HomeModule {

  constructor() { }

  toggleNav() {
  }
}
