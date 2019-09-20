import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AddCompanyComponent } from './company/add-company/add-company.component';
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
import { ProductImagesComponent } from './products/product-images/product-images.component';
import { UploadProductImageComponent } from './products/upload-product-image/upload-product-image.component';
import { SellComponent } from './products/sell/sell.component';
import { DashboardNavComponent } from './dashboard-nav';
import { SaleSammaryComponent } from './products/sell/sale-sammary/sale-sammary.component';
import { AddRoleComponent } from './users/add-role/add-role.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { ListRolesComponent } from './users/list-roles/list-roles.component';
import { ListStoresComponent } from './company/list-stores/list-stores.component';
import { AddStoreComponent } from './company/add-store/add-store.component';
import { SalesReportComponent } from './products/sales-report/sales-report.component';
import { ListOrdersComponent } from './products/list-orders/list-orders.component';
import { BrandComponent } from './brand';
import { OrderDetailsComponent } from './products/order-details/order-details.component';
import { UpdateCompanyComponent } from './company/update-company/update-company.component';
const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'add-company', component: AddCompanyComponent },
      { path: 'add-store', component: AddStoreComponent },
      { path: 'list-stores', component: ListStoresComponent },
      { path: 'add-role', component: AddRoleComponent },
      { path: 'add-user', component: AddUserComponent },
      { path: 'list-user', component: ListUsersComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'list-product', component: ListProductsComponent },
      { path: 'product-details', component: ProductDetailsComponent },
      { path: 'upload-product-image/:id', component: UploadProductImageComponent },
      { path: 'add-catergory', component: AddCatergoryComponent },
      { path: 'add-brand', component: AddBrandComponent },
      { path: 'sell', component: SellComponent },
      { path: 'sales-report', component: SalesReportComponent },
      { path: 'list-orders', component: ListOrdersComponent },
      { path: 'order-details', component: OrderDetailsComponent },
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
  ProductImagesComponent,
  UploadProductImageComponent,
  SellComponent,
  DashboardNavComponent,
  SaleSammaryComponent,
  AddRoleComponent,
  ListRolesComponent,
  AddUserComponent,
  ListUsersComponent,
  AddStoreComponent,
  ListStoresComponent,
  SalesReportComponent,
  ListOrdersComponent,
  OrderDetailsComponent,
  BrandComponent,
  UpdateCompanyComponent,

  // pipes
  SearchProductPipe
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
