
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
import { ListUsersComponent } from './users/list-users/list-users.component';
import { SalesReportComponent } from './products/sales-report/sales-report.component';
import { ListOrdersComponent } from './products/list-orders/list-orders.component';
import { BrandComponent, EditBrandComponent } from './brand';
import { OrderDetailsComponent } from './products/order-details/order-details.component';
import { UpdateCompanyComponent } from './company/update-company/update-company.component';
import { ConfigurationHomeComponent } from './configuration-home';
import { ActionsComponent, ConfigurationPermissions } from './shared';
import {
  RolesComponent,
  RoleCardListComponent,
  AddRoleComponent,
  RoleDetailsComponent,
  AddRolePermissionComponent,
  ListRolePermissionsComponent
} from './roles';
import { StoresComponent, StoreCardListComponent, AddStoreComponent, EditStoreComponent } from './stores';
import { ListCategoriesComponent } from './catergory/list-categories/list-categories.component';
import { ListBrandsComponent } from './brand/list-brands/list-brands.component';
import {
  UserCardListComponent,
  AddUserComponent,
  UserFormComponent,
  UserDetailsComponent,
  ListUserRolesComponent,
  AddUserRoleComponent,
  EditUserComponent
} from './users';
import {
  UserProfileComponent,
  UserProfileDetailsComponent,
  UserProfileResetPasswordComponent,
  UserProfileDpComponent
} from './user-profile';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { SplashComponent } from './shared/splash/splash.component';
import { PermissionsComponent, PermissionCardListComponent } from './permissions';
import { AddPermissionComponent } from './permissions/add-permission';
import { SearchProductByCatergoryPipe } from 'src/app/_pipes/search-product-by-catergory';
import { UploadPreviewComponent } from './image-proccessing/upload-preview/upload-preview.component';
import { AuthGuard } from 'src/app/_guards';
import { ConfigurationFilterPipe, UserFilterPipe } from 'src/app/_pipes';
import { FileUploadComponent } from './products/add-product/file-upload/file-upload.component';
import { VeliDashboardHelpComponent } from './veli-dashboard-help/veli-dashboard-help.component';
import { SupportComponent, ListSupportComponent, AddSupportComponent } from './support';
import { AddPartnerComponent } from './partners/add-partner/add-partner.component';
import { PartnersComponent } from './partners/partners/partners.component';
import { SearchPartnerPipe } from 'src/app/_pipes/search-partners.pipe';
import { ReportsComponent } from './reports/reports/reports.component';
import { EmailInvoiceComponent } from './products/email-invoice/email-invoice.component';
import { PartnerCardComponent } from './partners';
import { EditCategoryComponent } from './catergory';
import { CompanyViewConfigsComponent } from './company-config/company-view-configs/company-view-configs.component';
const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'add-company', component: AddCompanyComponent },
      { path: 'add-user', component: AddUserComponent },
      { path: 'edit-user', component: EditUserComponent },
      { path: 'list-user', component: ListUsersComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'list-product', component: ListProductsComponent },
      { path: 'product-details', component: ProductDetailsComponent },
      { path: 'upload-product-image/:id', component: UploadProductImageComponent },
      { path: 'add-catergory', component: AddCatergoryComponent },
      { path: 'edit-category', component: EditCategoryComponent },
      { path: 'add-brand', component: AddBrandComponent },
      { path: 'edit-brand', component: EditBrandComponent },
      { path: 'sell', component: SellComponent },
      { path: 'sales-report', component: SalesReportComponent },
      { path: 'list-orders', component: ListOrdersComponent },
      { path: 'order-details', component: OrderDetailsComponent },
      {
        path: 'configurations',
        component: ConfigurationHomeComponent,
        // canActivate: [AuthGuard],
        // data: {
        //   role: ConfigurationPermissions.CAN_CONFIGURE.key
        // }
      },
      { path: 'roles', component: RolesComponent },
      { path: 'add-role', component: AddRoleComponent },
      { path: 'stores', component: StoresComponent },
      { path: 'add-store', component: AddStoreComponent },
      { path: 'edit-store', component: EditStoreComponent },
      { path: 'users', component: ListUsersComponent },
      { path: 'user-details/:id', component: UserDetailsComponent },
      { path: 'list-categories', component: ListCategoriesComponent },
      { path: 'list-brands', component: ListBrandsComponent },
      { path: 'reset-password', component: UserProfileResetPasswordComponent },
      { path: 'permissions', component: PermissionsComponent },
      { path: 'add-permission', component: AddPermissionComponent },
      { path: 'role-details/:id', component: RoleDetailsComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'support', component: SupportComponent },
      { path: 'add-partner/:id', component: AddPartnerComponent },
      { path: 'partners/:id', component: PartnersComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'email-invoice', component: EmailInvoiceComponent },
      { path: 'company-view-configs/:id', component: CompanyViewConfigsComponent },

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
  AddUserComponent,
  ListUsersComponent,
  SalesReportComponent,
  ListOrdersComponent,
  OrderDetailsComponent,
  BrandComponent,
  UpdateCompanyComponent,
  ConfigurationHomeComponent,
  ActionsComponent,
  RolesComponent,
  RoleCardListComponent,
  AddRoleComponent,
  StoresComponent,
  StoreCardListComponent,
  AddStoreComponent,
  UserCardListComponent,
  ListCategoriesComponent,
  ListBrandsComponent,
  UserFormComponent,
  UserProfileComponent,
  UserProfileDetailsComponent,
  UserProfileResetPasswordComponent,
  SpinnerComponent,
  SplashComponent,
  PermissionsComponent,
  PermissionCardListComponent,
  AddPermissionComponent,
  RoleDetailsComponent,
  AddRolePermissionComponent,
  ListRolePermissionsComponent,
  UserProfileDpComponent,
  UserDetailsComponent,
  ListUserRolesComponent,
  AddUserRoleComponent,
  UploadPreviewComponent,
  RoleCardListComponent,
  FileUploadComponent,
  VeliDashboardHelpComponent,
  SupportComponent,
  ListSupportComponent,
  AddSupportComponent,
  AddPartnerComponent,
  PartnersComponent,
  ReportsComponent,
  EmailInvoiceComponent,
  PartnerCardComponent,
  EditStoreComponent,
  EditBrandComponent,
  EditCategoryComponent,
  EditUserComponent,
  CompanyViewConfigsComponent,
  // pipes
  SearchProductPipe,
  SearchProductByCatergoryPipe,
  UserFilterPipe,
  ConfigurationFilterPipe,
  SearchPartnerPipe
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
