import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerPage } from './barcode-scanner';
import { BarcodeScannerRoutingModule } from './barcode-scanner-routing.module';
import { BarcodeScannerModalComponent } from './barcode-scanner-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BarcodeScannerRoutingModule
  ],
  declarations: [
    BarcodeScannerPage, BarcodeScannerModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarcodeScannerModule { }
