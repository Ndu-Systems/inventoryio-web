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
import {ProgressBarModule} from 'primeng/progressbar';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CalendarModule} from 'primeng/calendar';
import {ColorPickerModule} from 'primeng/colorpicker';
import {DialogModule} from 'primeng/dialog';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ChipsModule} from 'primeng/chips';
import {InputTextModule} from 'primeng/inputtext';
import {EditorModule} from 'primeng/editor';
import {TooltipModule} from 'primeng/tooltip';


// import { NgxBarcodeModule } from 'ngx-barcode';



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
    ChartModule,
    ProgressBarModule,
    AutoCompleteModule,
    ProgressSpinnerModule,
    CalendarModule,
    ColorPickerModule,
    DialogModule,
    InputSwitchModule,
    ChipsModule,
    InputTextModule,
    EditorModule
    // NgxBarcodeModule

  ],
  declarations: [...declarations],
  providers: [MessageService, ConfirmationService]
})
export class DashboardModule { }
