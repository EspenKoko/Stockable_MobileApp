import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordPage } from './forgot-password';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ForgotPasswordRoutingModule
  ],
  declarations: [
    ForgotPasswordPage,
  ]
})
export class ForgotPasswordModule { }
