import { Component, OnInit } from '@angular/core';
import { CateroryService } from 'src/app/_services/dashboard';
import { Caterory } from 'src/app/_models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shop-by-category',
  templateUrl: './shop-by-category.component.html',
  styleUrls: ['./shop-by-category.component.scss']
})
export class ShopByCategoryComponent implements OnInit {
  catergory: Caterory[];
  catergoryId: string;
  constructor(
    private cateroryService: CateroryService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.catergoryId = r.id;
      this.cateroryService.getCatergoryById(this.catergoryId).subscribe(data => {
        if (data) {
          this.catergory = data;
        }
      });
    });
  }

  ngOnInit() {

  }

}
