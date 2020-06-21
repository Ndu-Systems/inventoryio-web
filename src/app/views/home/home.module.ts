import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule, declarations } from './home-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleriaModule } from 'primeng/galleria';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'ng4-social-login';
import { CheckboxModule } from 'primeng/checkbox';

const config = new AuthServiceConfig(
  [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('50242229104-91l41kdgsdj26nl3tdjk90u1jkee8pnj.apps.googleusercontent.com')
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('556948278290789')
    }
  ], false
);

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule, ReactiveFormsModule,
    GalleriaModule,
    CardModule,
    ToastModule,
    CarouselModule,
    SocialLoginModule,
    CheckboxModule
  ],
  declarations: [
    ...declarations
  ],
  providers: [MessageService, ConfirmationService, { provide: AuthServiceConfig, useFactory: provideConfig }]

})
export class HomeModule {

  constructor() { }

  toggleNav() {
  }
}
