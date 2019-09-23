import { Component, OnInit, Input } from '@angular/core';
import { UserActions } from 'src/app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  @Input() actions: UserActions[];
  constructor(
    private routeTo: Router
  ) { }

  ngOnInit() {
  }

  openAction(link) {
    if (link) {
      this.routeTo.navigate([link]);
    }
  }

}
