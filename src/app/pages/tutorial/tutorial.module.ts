import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TutorialPage } from './tutorial';
import { TutorialPageRoutingModule } from './tutorial-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        TutorialPageRoutingModule,
        FormsModule
    ],
    declarations: [TutorialPage]
})
export class TutorialModule {}
