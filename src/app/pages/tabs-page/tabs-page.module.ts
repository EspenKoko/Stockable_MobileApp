import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';

import { AboutModule } from '../about/about.module';
import { ErrorLogsModule } from '../error-logs/error-logs.module';
import { LandingPageModule } from '../landing-screen/landing-page.module';
import { ErrorNavigationsModule } from '../error-pages/error-pages.module';
import { InfieldChecklistModule } from '../infield-checklist/infield-checklist.module';
import { BarcodeScannerModule } from '../barcode-scanner/barcode-scanner.module';

@NgModule({
  imports: [
    AboutModule,
    CommonModule,
    IonicModule,
    ErrorLogsModule,
    BarcodeScannerModule,
    ErrorNavigationsModule,
    LandingPageModule,
    InfieldChecklistModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage,
  ]
})
export class TabsModule { }
