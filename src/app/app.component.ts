import { Component, OnInit } from '@angular/core';
import { PwaService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public pwaService: PwaService) {

  }
  ngOnInit() {
  }
  installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }
}
