import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountUpdateRoutingModule } from './account-update-routing.module';
import { AccountUpdatePage } from './account-update';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AccountUpdateRoutingModule
  ],
  declarations: [
    AccountUpdatePage,
  ]
})
export class AccountUpdateModule { }
