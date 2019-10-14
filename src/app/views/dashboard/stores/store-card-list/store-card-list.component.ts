import { Component, OnInit, Input } from '@angular/core';
import { Store, NotFoundModel } from 'src/app/_models';
import { Observable } from 'rxjs';
import { NotFoundConstants } from '../../shared';

@Component({
  selector: 'app-store-card-list',
  templateUrl: './store-card-list.component.html',
  styleUrls: ['./store-card-list.component.scss']
})
export class StoreCardListComponent implements OnInit {
 @Input() store: Store;
  constructor() { }

  ngOnInit() {

  }

}
