import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormatOptionsPipe } from 'src/app/_pipes/format-options.pipe';
// import { ShopsComponent } from './components/shop/shops/shops.component';
import { ShoppingCartComponent } from './components/shop/shopping-cart/shopping-cart.component';
import { ShopingSuccesfulComponent } from './components/shop/shoping-succesful/shoping-succesful.component';
import { ViewProductComponent } from './components/shop/view-product/view-product.component';
import { ShippingComponent } from './components/shop/shipping/shipping.component';
import { ViewImagesComponent } from './components/shop/view-images/view-images.component';
import { ShoppingComponent } from './components/shop/shopping/shopping.component';
import { ShopComponent } from './components/shop/shop/shop.component';
import { ShoppingNavComponent } from './components/shop/shopping-nav/shopping-nav.component';
import { ShopCheckoutComponent } from './components/shop/shop-checkout/shop-checkout.component';
import { ShoppingService } from 'src/app/_services/home/shoping/shopping.service';
import { RemoveNoValuesAttributesPipe } from 'src/app/_pipes/remove-no-values-attributes.pipe';
import { CustomerPortalComponent } from './components/customer-portal/customer-portal.component';
import { CustomerLoginComponent } from './components/customer-login/customer-login.component';
import { CustomerSignupComponent } from './components/customer-signup/customer-signup.component';
import { CustomerOrdersComponent } from './components/customer-orders/customer-orders.component';
import { CustomerNavBarComponent } from './components/customer-nav-bar/customer-nav-bar.component';
import { CustomerOrderDetailsComponent } from './components/customer-order-details/customer-order-details.component';
import { FormatDashBoardOptionsPipeCustomer } from 'src/app/_pipes/format-dashboard-options.pipe-customer';
import { ProductSliderComponent } from './components/shop/product-slider/product-slider.component';
const routes: Routes = [
  {
    path: '', component: ShoppingComponent,
    children: [
      // { path: '', component: ShopsComponent },
      { path: 'at/:id', component: ShopComponent },
      { path: 'shopping-cart/:id', component: ShoppingCartComponent },
      { path: 'shoping-succesful/:id', component: ShopingSuccesfulComponent },
      { path: 'view-product/:id', component: ViewProductComponent },
      { path: 'checkout/:id', component: ShopCheckoutComponent },
      { path: 'customer-login/:id', component: CustomerLoginComponent },
      { path: 'customer-signup/:id', component: CustomerSignupComponent },
      { path: 'customer-portal/:id', component: CustomerPortalComponent },
      { path: 'customer-orders/:id', component: CustomerOrdersComponent },
      { path: 'customer-order-details/:id', component: CustomerOrderDetailsComponent },
    ]
  }
];

export const declarations = [
  ShoppingComponent,
  // ShopsComponent,
  ShopComponent,
  ShoppingCartComponent,
  ShopingSuccesfulComponent,
  ViewProductComponent,
  ShippingComponent,
  ViewImagesComponent,
  ShoppingNavComponent,
  ShopCheckoutComponent,
  FormatOptionsPipe,
  RemoveNoValuesAttributesPipe,
  CustomerPortalComponent,
  CustomerLoginComponent,
  CustomerSignupComponent,
  CustomerOrdersComponent,
  CustomerNavBarComponent,
  CustomerOrderDetailsComponent,
  FormatDashBoardOptionsPipeCustomer,
  ProductSliderComponent
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule {
  constructor(hoppingService: ShoppingService) { }
}
