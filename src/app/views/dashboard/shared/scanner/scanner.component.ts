import { Component, OnInit } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
// Wikki  https://github.com/zxing-js/ngx-scanner/wiki/Advanced-Usage
export class ScannerComponent implements OnInit {
  qrResultString: string;
  torch = true; // enable device light
  allowedFormats: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];


  constructor() { }

  ngOnInit() {
  }
  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    alert(this.qrResultString);
  }
  scanErrorHandler(error: string) {
    alert(error);
  }
  scanCompleteHandler(result: string) {
    // alert(result);
    // Emitted after any scan attempt, no matter what.
  }
}
