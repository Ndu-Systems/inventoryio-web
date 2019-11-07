import { Component, OnInit, Input } from '@angular/core';
import { Support } from 'src/app/_models';

@Component({
  selector: 'app-list-support',
  templateUrl: './list-support.component.html',
  styleUrls: ['./list-support.component.scss']
})
export class ListSupportComponent implements OnInit {
  @Input() tickets: Support[];

  constructor() { }

  ngOnInit() {
  }

}
