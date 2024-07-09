import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountUpdatePage } from './account-update';


const routes: Routes = [
  {
    path: '',
    component: AccountUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountUpdateRoutingModule { }
