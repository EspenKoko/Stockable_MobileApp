import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForbiddenComponent, PageNotFoundComponent } from './error-pages.component';
import { ErrorNavigationPageRoutingModule } from './error-pages-routing.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ErrorNavigationPageRoutingModule
    ],
    declarations: [
        ForbiddenComponent,
        PageNotFoundComponent
    ]
})
export class ErrorNavigationsModule { }
