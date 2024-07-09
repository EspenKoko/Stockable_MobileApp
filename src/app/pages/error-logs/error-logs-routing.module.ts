import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorLogsPage } from './error-logs';

const routes: Routes = [
  {
    path: '', 
    component: ErrorLogsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorLogsPageRoutingModule { }
