import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';
import { ErrorLogsPage } from '../error-logs/error-logs';


const routes: Routes = [
  {
    path: 'tabs', component: TabsPage,
    children: [
      {
        path: 'error-logs',
        children: [
          {
            path: '',
            component: ErrorLogsPage,
          },

        ]
      },
      {
        path: 'barcode-scanner',
        children: [
          {
            path: '',
            loadChildren: () => import('../barcode-scanner/barcode-scanner.module').then(m => m.BarcodeScannerModule)
          }
        ]
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../landing-screen/landing-page.module').then(m => m.LandingPageModule)
          },
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

