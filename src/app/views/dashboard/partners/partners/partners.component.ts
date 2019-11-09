import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent implements OnInit {
  type: any;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.type = r.id;
    });
  }

  ngOnInit() {
  }

}
