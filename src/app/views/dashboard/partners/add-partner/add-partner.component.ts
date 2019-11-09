import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss']
})
export class AddPartnerComponent implements OnInit {
  type: string;
  
  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.type = r['id'];
    });
  }

  ngOnInit() {
  }

}
