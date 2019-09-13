import { Component, OnInit, Input } from '@angular/core';
import { BannerService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { Banner } from 'src/app/_models';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  banner$: Observable<Banner>;

  constructor(private bannerService: BannerService) { }

  ngOnInit() {
    this.banner$ = this.bannerService.currentsBanner;
  }

}
