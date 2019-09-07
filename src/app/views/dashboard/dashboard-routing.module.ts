import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { BannerComponent } from './shared/banner/banner.component';
import { UserStatComponent } from './dashboard-home/user-stat/user-stat.component';
const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'add-company', component: AddCompanyComponent },
    ]
  },
];

export const declarations = [
  DashboardComponent,
  DashboardHomeComponent,
  AddCompanyComponent,
  BannerComponent,
  UserStatComponent
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
