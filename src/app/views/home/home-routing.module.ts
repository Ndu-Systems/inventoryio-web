import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { SignInComponent } from './accounts/sign-in/sign-in.component';
import { SignUpComponent } from './accounts/sign-up/sign-up.component';
import { IndexComponent } from './index/index.component';
import { HomePageComponent } from './index/home-page/home-page.component';
import { FeaturesComponent } from './index/features/features.component';
import { SplashHomeComponent } from '../dashboard/shared/splash-home/splash-home.component';
import { PricingComponent } from './index/Pricing/Pricing.component';
import { DownloadInvoiceComponent } from '../dashboard/invoicing/download-invoice/download-invoice.component';
const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'home', component: IndexComponent },
      { path: '', component: SignInComponent },
      { path: 'Pricing',component: PricingComponent},
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'download-invoice/:id', component: DownloadInvoiceComponent },

    ]
  }
];

export const declarations = [SignInComponent,
  HomeComponent, SignUpComponent, IndexComponent,
  HomePageComponent, FeaturesComponent,SplashHomeComponent,PricingComponent,DownloadInvoiceComponent];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
