import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { SplashHomeComponent } from '../dashboard/shared/splash-home/splash-home.component';
import { PricingComponent } from './index/Pricing/Pricing.component';
import { HomeNavComponent } from './shared/home-nav';
import {
  IndexComponent,
  HomePageComponent,
  FeaturesComponent,
  HowItWorksComponent,
  FaqsComponent
} from './index';
import {
  SignUpComponent,
  SignInComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent
} from './accounts';
import { HomeSliderComponent } from './home-slider/home-slider.component';
import { InlineHomeLoaderComponent } from './inline-home-loader/inline-home-loader.component';
import { HomeFooterComponent } from './home-footer';
import { ShopsComponent } from '../shopping/components/shop/shops/shops.component';
import { OurModulesComponent } from './our-modules';
import { ShopsHomeSliderComponent } from '../shopping/components/shop/shops/shops-home-slider/shops-home-slider.component';
import { CategoriesSliderComponent } from '../shopping/components/shop/shops/categories-slider/categories-slider.component';
import { ShopsListSliderComponent } from '../shopping/components/shop/shops/shops-list-slider/shops-list-slider.component';
import { ShopComponent } from '../shopping/components/shop/shop/shop.component';
import { ViewProductComponent } from '../shopping/components/shop/view-product/view-product.component';
import { ViewImagesComponent } from '../shopping/components/shop/view-images/view-images.component';
import { RemoveNoValuesAttributesPipe } from 'src/app/_pipes/remove-no-values-attributes.pipe';
const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'home', component: IndexComponent },
      { path: '', component: IndexComponent },
      { path: 'modules', component: OurModulesComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'shop', component: ShopsComponent },
      { path: 'at/:id', component: ShopComponent },
      { path: 'view-product/:id', component: ViewProductComponent },

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
  ForgotPasswordComponent,
  ResetPasswordComponent,
  InlineHomeLoaderComponent,
  HomeFooterComponent,
  FaqsComponent,
  ShopsComponent,
  OurModulesComponent,
  ShopsHomeSliderComponent,
  CategoriesSliderComponent,
  ShopsListSliderComponent,
  ShopComponent,
  ViewProductComponent,
  ViewImagesComponent,
  RemoveNoValuesAttributesPipe
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
