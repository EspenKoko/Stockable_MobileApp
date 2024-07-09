import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExchangePrinterPageRoutingModule } from './exchange-printer-routing.module';

import { ExchangePrinterPage } from './exchange-printer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExchangePrinterPageRoutingModule
  ],
  declarations: [ExchangePrinterPage]
})
export class ExchangePrinterPageModule {}
