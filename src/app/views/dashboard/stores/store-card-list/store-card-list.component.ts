import { Component, OnInit, Input } from '@angular/core';
import { Store, NotFoundModel } from 'src/app/_models';
import { Observable } from 'rxjs';
import { NotFoundConstants } from '../../shared';
import { StoresService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-card-list',
  templateUrl: './store-card-list.component.html',
  styleUrls: ['./store-card-list.component.scss']
})
export class StoreCardListComponent implements OnInit {
 @Input() store: Store;
  constructor(
    private storeService: StoresService,
    private routeTo: Router
  ) { }

  ngOnInit() {

  }

  updateStore(store: Store) {
    this.storeService.updateCurrentStore(store);
    this.routeTo.navigate([`/dashboard/edit-store`]);
  }

}
