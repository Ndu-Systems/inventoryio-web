import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { SignInComponent } from './accounts/sign-in/sign-in.component';
import { SignUpComponent } from './accounts/sign-up/sign-up.component';
import { IndexComponent } from './index/index.component';
import { HomePageComponent } from './index/home-page/home-page.component';
const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', component: IndexComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
    ]
  }
];

export const declarations = [SignInComponent, HomeComponent, SignUpComponent, IndexComponent, HomePageComponent];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
