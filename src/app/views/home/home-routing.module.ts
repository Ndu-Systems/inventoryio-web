import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { SplashHomeComponent } from '../dashboard/shared/splash-home/splash-home.component';
import { PricingComponent } from './index/Pricing/Pricing.component';
import { HomeNavComponent } from './shared/home-nav';
import { IndexComponent, HomePageComponent, FeaturesComponent, HowItWorksComponent } from './index';
import { SignUpComponent, SignInComponent } from './accounts';
import { DownloadInvoiceComponent } from '../dashboard/invoicing/download-invoice/download-invoice.component';
import { HomeSliderComponent } from './home-slider/home-slider.component';
const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'home', component: IndexComponent },
      { path: '', component: SignInComponent },
      { path: 'how-it-works', component: HowItWorksComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'download-invoice/:id', component: DownloadInvoiceComponent },

    ]
  }
];

export const declarations = [
  SignInComponent,
  SignUpComponent,
  HomeComponent,
  IndexComponent,
  HomePageComponent,
  FeaturesComponent,
  SplashHomeComponent,
  PricingComponent,
  DownloadInvoiceComponent,
  HomeNavComponent,
  HomeSliderComponent,
  HowItWorksComponent
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
