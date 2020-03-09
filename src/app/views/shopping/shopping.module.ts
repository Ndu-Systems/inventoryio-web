import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingRoutingModule, declarations } from './shopping-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ShoppingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...declarations]
})
export class ShoppingModule { }
