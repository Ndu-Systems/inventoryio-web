import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule, declarations } from './dashboard-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule, ReactiveFormsModule,

  ],
  declarations: [...declarations]
})
export class DashboardModule { }
