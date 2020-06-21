import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', loadChildren: './views/home/home.module#HomeModule' },
  { path: 'dashboard', loadChildren: './views/dashboard/dashboard.module#DashboardModule' },
  { path: 'shop', loadChildren: './views/shopping/shopping.module#ShoppingModule' },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
