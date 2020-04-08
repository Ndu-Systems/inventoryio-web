import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule, declarations } from './home-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {GalleriaModule} from 'primeng/galleria';
import { ToastModule } from 'primeng/toast';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import { ConfirmationService, MessageService } from 'primeng/api';



@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule, ReactiveFormsModule,
    GalleriaModule,
    CardModule,
    ToastModule,
    CarouselModule
  ],
  declarations: [
    ...declarations
  ],
  providers: [MessageService, ConfirmationService]

})
export class HomeModule {

  constructor() { }

  toggleNav() {
  }
}
