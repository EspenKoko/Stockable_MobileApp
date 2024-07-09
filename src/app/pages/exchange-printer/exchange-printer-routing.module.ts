import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExchangePrinterPage } from './exchange-printer.page';

const routes: Routes = [
  {
    path: '',
    component: ExchangePrinterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangePrinterPageRoutingModule {}
