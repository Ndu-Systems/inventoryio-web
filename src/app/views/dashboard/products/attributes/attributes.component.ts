import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit {
  @Input() id;
  displayModal: boolean;

  constructor() { }

  ngOnInit() {
  }
  showModalDialog() {
    this.displayModal = true;
}

}
