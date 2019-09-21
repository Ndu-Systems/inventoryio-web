import { Component } from '@angular/core';
import { PwaService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public pwaService: PwaService) {

  }
  installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }
}
