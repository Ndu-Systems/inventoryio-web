import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { INVOICE_URL } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  url: any;
  invoiceUrl: any;

  constructor() {
    this.url = environment.API_URL;
    this.invoiceUrl = INVOICE_URL;

  }
  getInvoiceURL(orderId: string) {
    return `${this.url}/api/${this.invoiceUrl}?guid=${orderId}`;
  }
}
