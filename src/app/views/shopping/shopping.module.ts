import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingRoutingModule, declarations } from './shopping-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  imports: [
    CommonModule,
    ShoppingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule
  ],
  declarations: [...declarations],
  providers: [MessageService, ConfirmationService]

})
export class ShoppingModule { }
