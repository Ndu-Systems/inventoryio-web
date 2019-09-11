import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { BannerComponent } from './shared/banner/banner.component';
import { UserStatComponent } from './dashboard-home/user-stat/user-stat.component';
import { UserActionsComponent } from './dashboard-home/user-actions/user-actions.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { SearchProductPipe } from 'src/app/_pipes/search-product.pipe';
import { ScannerComponent } from './shared/scanner/scanner.component';
import { AddCatergoryComponent } from './catergory/add-catergory/add-catergory.component';
import { AddBrandComponent } from './brand/add-brand/add-brand.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { UploadImagesComponent } from './products/upload-images/upload-images.component';
const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'add-company', component: AddCompanyComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'list-product', component: ListProductsComponent },
      { path: 'product-details/:id', component: ProductDetailsComponent },
      { path: 'add-catergory', component: AddCatergoryComponent },
      { path: 'add-brand', component: AddBrandComponent },
    ]
  },
];

export const declarations = [
  DashboardComponent,
  DashboardHomeComponent,
  AddCompanyComponent,
  BannerComponent,
  UserStatComponent,
  UserActionsComponent,
  AddProductComponent,
  ListProductsComponent,
  ProductDetailsComponent,
  ScannerComponent,
  AddCatergoryComponent,
  AddBrandComponent,
  UploadImagesComponent,

  // pipes
  SearchProductPipe
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
