import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordPage } from './change-password';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ChangePasswordRoutingModule
  ],
  declarations: [
    ChangePasswordPage,
  ]
})
export class ChangePasswordModule { }
