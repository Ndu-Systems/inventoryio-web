import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormatOptionsPipe } from 'src/app/_pipes/format-options.pipe';
import { ShopsComponent } from './components/shop/shops/shops.component';
import { ShoppingCartComponent } from './components/shop/shopping-cart/shopping-cart.component';
import { ShopingSuccesfulComponent } from './components/shop/shoping-succesful/shoping-succesful.component';
import { ViewProductComponent } from './components/shop/view-product/view-product.component';
import { ShippingComponent } from './components/shop/shipping/shipping.component';
import { ViewImagesComponent } from './components/shop/view-images/view-images.component';
import { ShoppingComponent } from './components/shop/shopping/shopping.component';
import { ShopComponent } from './components/shop/shop/shop.component';
import { ShoppingNavComponent } from './components/shop/shopping-nav/shopping-nav.component';
const routes: Routes = [
  {
    path: '', component: ShoppingComponent,
    children: [
      { path: '', component: ShopsComponent },
      { path: 'shop/:id', component: ShopComponent },
      { path: 'shopping-cart/:id', component: ShoppingCartComponent },
      { path: 'shoping-succesful/:id', component: ShopingSuccesfulComponent },
      { path: 'view-product/:id', component: ViewProductComponent },
    ]
  }
];

export const declarations = [
  ShoppingComponent,
  ShopsComponent,
  ShopComponent,
  ShoppingCartComponent,
  ShopingSuccesfulComponent,
  ViewProductComponent,
  ShippingComponent,
  ViewImagesComponent,
  ShoppingNavComponent,
  FormatOptionsPipe
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule { }
