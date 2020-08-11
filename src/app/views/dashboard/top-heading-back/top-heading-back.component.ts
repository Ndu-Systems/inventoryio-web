import { Component, OnInit, Input } from '@angular/core';
import { TopHeading } from 'src/app/_models/top-heading.model';

@Component({
  selector: 'app-top-heading-back',
  templateUrl: './top-heading-back.component.html',
  styleUrls: ['./top-heading-back.component.scss']
})
export class TopHeadingBackComponent implements OnInit {
  @Input() heading: TopHeading;
  constructor() { }

  ngOnInit() {
  }

}

