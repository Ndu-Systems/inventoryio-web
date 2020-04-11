import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { INVOICE_URL, QUOTATION_URL, CREDIT_NOTE_URL } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  url: any;
  invoiceUrl: any;
  quotationUrl: any;
  creditNoteUrl: any;

  constructor() {
    this.url = environment.API_URL;
    this.invoiceUrl = INVOICE_URL;
    this.quotationUrl =  QUOTATION_URL;
    this.creditNoteUrl =  CREDIT_NOTE_URL;
  }
  getInvoiceURL(orderId: string) {
    return `${this.url}/api/${this.invoiceUrl}?guid=${orderId}`;
  }
  getQuotationURL(orderId: string) {
    return `${this.url}/api/${this.quotationUrl}?guid=${orderId}`;
  }
  getCrediNoteURL(orderId: string) {
    return `${this.url}/api/${this.creditNoteUrl}?guid=${orderId}`;
  }
}
