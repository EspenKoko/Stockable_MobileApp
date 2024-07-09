import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralServices } from '../../services/general-services';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styles: []
})
export class ForbiddenComponent {

  constructor(private location: Location,
    private router: Router,
    private storage: Storage,
    private generalService: GeneralServices
    ) {

  }

  async back(event: Event) {
    event.preventDefault();

    if (await this.storage.get("Token")) {
      this.location.back();
    }
    else {
      this.router.navigate(["sign-in"]).then((navigated: boolean) => {
        if (navigated) {
          this.generalService.presentToast("Please log in again", 5000);
        }
      })
    }
  }
}

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styles: []
})
export class PageNotFoundComponent {

  constructor(private location: Location) { }

  back(event: Event) {
    event.preventDefault();
    return this.location.back();
  }
}