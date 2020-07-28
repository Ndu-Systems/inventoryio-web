import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Caterory, Company } from 'src/app/_models';
import { CateroryService } from 'src/app/_services';

@Component({
  selector: 'app-main-category',
  templateUrl: './main-category.component.html',
  styleUrls: ['./main-category.component.scss']
})
export class MainCategoryComponent implements OnInit {
  catergory: Caterory;
  catergoryId: string;
  company: Company;
  constructor(
    private cateroryService: CateroryService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.catergoryId = r.id;
      this.cateroryService.getParentCatergoryById(this.catergoryId).subscribe(data => {
        if (data) {
          this.catergory = data;
          this.company = this.catergory.Company;
        }
      });
    });
  }

  ngOnInit() {

  }

  back() {
    this.router.navigate(['at', this.company.Handler || this.company.CompanyId]);
  }
  gotToParent() {
    this.router.navigate(['main-category', this.catergory.Handler || this.catergory.CatergoryId]);
  }
  openCatergory(caterory: Caterory) {
    this.router.navigate(['shop-by-category', caterory.CatergoryId]);
  }
}
