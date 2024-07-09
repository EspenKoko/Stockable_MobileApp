import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { checkTutorialGuard } from './providers/check-tutorial.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  //nav links
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    canMatch: [checkTutorialGuard]
  },

  // non tab routes
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then(m => m.ChangePasswordModule)
  },
  {
    path: 'account-update',
    loadChildren: () => import('./pages/account-update/account-update.module').then(m => m.AccountUpdateModule)
  },
  {
    path: 'infield-checklist/:errorLogId', // Define the route with a parameter
    loadChildren: () => import('./pages/infield-checklist/infield-checklist.module').then(m => m.InfieldChecklistModule)
  },
  {
    path: 'exchange-printer/:errorLogId',
    loadChildren: () => import('./pages/exchange-printer/exchange-printer.module').then( m => m.ExchangePrinterPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
