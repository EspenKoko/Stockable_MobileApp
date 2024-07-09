import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ErrorLogsPage } from './error-logs';
import { ErrorLogsFilterPage } from '../error-logs-filter/error-logs-filter';
import { ErrorLogsPageRoutingModule } from './error-logs-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ErrorLogsPageRoutingModule
    ],
    declarations: [
        ErrorLogsPage,
        ErrorLogsFilterPage
    ]
})
export class ErrorLogsModule { }
