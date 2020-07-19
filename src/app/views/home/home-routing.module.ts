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
import { ShoppingCartComponent } from '../shopping/components/shop/shopping-cart/shopping-cart.component';
import { ShopingSuccesfulComponent } from '../shopping/components/shop/shoping-succesful/shoping-succesful.component';
import { ShopCheckoutComponent } from '../shopping/components/shop/shop-checkout/shop-checkout.component';
import { FormatOptionsPipe } from 'src/app/_pipes/format-options.pipe';
import { ShippingComponent } from '../shopping/components/shop/shipping/shipping.component';
import { CustomerSignupComponent } from '../shopping/components/customer-signup/customer-signup.component';
import { CustomerLoginComponent } from '../shopping/components/customer-login/customer-login.component';
import { PaymentCanceledComponent } from '../shopping/components/shop/payment-canceled/payment-canceled.component';
import { PaymentCallbackComponent } from '../shopping/components/shop/payment-callback/payment-callback.component';
import { HomeShoppingComponent } from '../shopping/components/home-shopping/home-shopping.component';
const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      // { path: 'home', component: IndexComponent },
      { path: 'home', component: HomeShoppingComponent },
      { path: '', component: HomeShoppingComponent },
      // { path: '', component: IndexComponent },
      { path: 'modules', component: OurModulesComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'shop', component: ShopsComponent },
      { path: 'at/:id', component: ShopComponent },
      { path: 'view-product/:id', component: ViewProductComponent },
      { path: 'shopping-cart', component: ShoppingCartComponent },
      { path: 'shoping-succesful/:id', component: ShopingSuccesfulComponent },
      { path: 'checkout/:id', component: ShopCheckoutComponent },
      { path: 'shoping-succesful/:id', component: ShopingSuccesfulComponent },
      { path: 'payment-cancelled/:id', component: PaymentCanceledComponent },
      { path: 'payment-callback', component: PaymentCallbackComponent },

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
  RemoveNoValuesAttributesPipe,
  ShoppingCartComponent,
  ShopingSuccesfulComponent,
  ShopCheckoutComponent,
  FormatOptionsPipe,
  ShippingComponent,
  CustomerSignupComponent,
  CustomerLoginComponent,
  PaymentCanceledComponent,
  PaymentCallbackComponent,
  HomeShoppingComponent
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
