import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule, declarations } from './dashboard-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/components/common/messageservice';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ChartModule} from 'primeng/chart';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    FileUploadModule,
    ToastModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    FontAwesomeModule,
    KeyFilterModule,
    ChartModule

  ],
  declarations: [...declarations],
  providers: [MessageService, ConfirmationService]
})
export class DashboardModule { }
