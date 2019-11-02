import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { SignInComponent } from './accounts/sign-in/sign-in.component';
import { SignUpComponent } from './accounts/sign-up/sign-up.component';
import { IndexComponent } from './index/index.component';
import { HomePageComponent } from './index/home-page/home-page.component';
import { FeaturesComponent } from './index/features/features.component';
import { SplashComponent } from '../dashboard/shared/splash/splash.component';
const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'home', component: IndexComponent },
      { path: '', component: SignInComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent }]
  }
];

export const declarations = [SignInComponent,
  HomeComponent, SignUpComponent, IndexComponent,
  HomePageComponent, FeaturesComponent, SplashComponent];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
