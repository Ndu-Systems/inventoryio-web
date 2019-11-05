import { Component, OnInit } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { SplashService } from 'src/app/_services/splash.service';

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


  constructor(private splashService: SplashService) { }

  ngOnInit() {
  }
  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.splashService.update({
      show: true, heading: 'Network Error',
      message: resultString,
      class: `error`
    });
  }
  scanErrorHandler(error: string) {
    this.splashService.update({
      show: true, heading: 'Network Error',
      message: error,
      class: `error`
    });
  }
  scanCompleteHandler(result: string) {

  }
}
