import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SmsModel, BulkSmsModel, From } from 'src/app/_models';
import { BULK_SMS_API, BULK_SMS_KEY, BULK_SMS_USER, COMBINED_TOKEN } from 'src/app/_shared';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  apiUrl = BULK_SMS_API;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${COMBINED_TOKEN}`
    })
  };
  constructor(private httpClient: HttpClient) { }

  post(sms: SmsModel) {
    const from: From = {
      type: 'LOCAL',
      address: '1111111'
    };
    const toSendSMS: BulkSmsModel = {
      to: [
        '27746958064'
      ],
      from,
      routingGroup: 'ECONOMY',
      encoding: 'TEXT',
      longMessageMaxParts: 99,
      body: sms.body,
      protocolId: 'IMPLICIT',
      messageClass: 'FLASH_SMS',
      deliveryReports: 'ALL'
    };
    this.httpClient.post<any>(this.apiUrl, toSendSMS, this.httpOptions).subscribe(
      data => {
        if (data) {
          alert('SMS WAS SENt');
        } else {
          alert('She is dead jimi');
        }
      }
    )
  }
}
