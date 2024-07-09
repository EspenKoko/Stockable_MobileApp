import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LandingPage } from './landing-page';
import { LandingPageRoutingModule } from './landing-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LandingPageRoutingModule
  ],
  declarations: [LandingPage],
})
export class LandingPageModule {}
