import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { SplashHomeComponent } from '../dashboard/shared/splash-home/splash-home.component';
import { PricingComponent } from './index/Pricing/Pricing.component';
import { HomeNavComponent } from './shared/home-nav';
import { IndexComponent, HomePageComponent, FeaturesComponent, HowItWorksComponent } from './index';
import { SignUpComponent, SignInComponent } from './accounts';
import { HomeSliderComponent } from './home-slider/home-slider.component';
import { ShopComponent } from './index/shop/shop.component';
import { ShoppingCartComponent } from './index/shop/shopping-cart/shopping-cart.component';
import { ShippingComponent } from './index/shop/shipping/shipping.component';
import { ShopingSuccesfulComponent } from './index/shop/shoping-succesful/shoping-succesful.component';
const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'home', component: IndexComponent },
      { path: '', component: SignInComponent },
      { path: 'how-it-works', component: HowItWorksComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'shop/:id', component: ShopComponent },
      { path: 'shopping-cart/:id', component: ShoppingCartComponent },
      { path: 'shoping-succesful/:id', component: ShopingSuccesfulComponent },
      { path: 'sign-up', component: SignUpComponent },

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
  HomeNavComponent,
  HomeSliderComponent,
  HowItWorksComponent,
  ShopComponent,
  ShoppingCartComponent,
  ShippingComponent,
  ShopingSuccesfulComponent
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
