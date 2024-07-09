import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfieldChecklistRoutingModule } from './infield-checklist-routing.module';

import { InfieldChecklist } from './InfieldChecklist';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfieldChecklistRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [InfieldChecklist]
})
export class InfieldChecklistModule {}
