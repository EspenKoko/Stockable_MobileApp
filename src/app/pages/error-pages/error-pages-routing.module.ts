import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForbiddenComponent, PageNotFoundComponent } from './error-pages.component';


const routes: Routes = [
  {
    path: 'unauthorised',
    component: ForbiddenComponent
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorNavigationPageRoutingModule { }
