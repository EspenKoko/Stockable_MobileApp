import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfieldChecklist } from './InfieldChecklist';

const routes: Routes = [
  {
    path: '',
    component: InfieldChecklist
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfieldChecklistRoutingModule {}
