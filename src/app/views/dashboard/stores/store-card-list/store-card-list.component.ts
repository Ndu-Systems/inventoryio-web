import { Component, OnInit, Input } from '@angular/core';
import { Store } from 'src/app/_models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-store-card-list',
  templateUrl: './store-card-list.component.html',
  styleUrls: ['./store-card-list.component.scss']
})
export class StoreCardListComponent implements OnInit {
 @Input() stores: Observable<Store[]>;
  constructor() { }

  ngOnInit() {
  }

}
