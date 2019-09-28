import { Component, OnInit, Input } from '@angular/core';
import { Permission, SystemPermissionModel } from 'src/app/_models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-permission-card-list',
  templateUrl: './permission-card-list.component.html',
  styleUrls: ['./permission-card-list.component.scss']
})
export class PermissionCardListComponent implements OnInit {
  @Input() permissions: SystemPermissionModel[];
  constructor() { }

  ngOnInit() {
  }

}
