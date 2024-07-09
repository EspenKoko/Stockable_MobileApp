import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController, ToastController } from '@ionic/angular';

import { Storage } from '@ionic/storage-angular';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
})
export class TutorialPage {
  showSkip = true;

  constructor(
    public menu: MenuController,
    public router: Router,
    private userData: UserData,
    public storage: Storage,
    private toastController: ToastController
  ) { }

  public checkboxes = [
    { label: 'Checkbox 1', checked: false },
    { label: 'Checkbox 2', checked: false },
    { label: 'Checkbox 3', checked: false },
    { label: 'Checkbox 4', checked: false }
  ];

  startApp() {
    if (!this.userData.isLoggedIn()) {
      this.router
        .navigateByUrl('/app/tabs/error-logs', { replaceUrl: true })
        .then(() => this.storage.set('ion_did_tutorial', true));
    }
    else {
      this.router
        .navigateByUrl('/login', { replaceUrl: true })
        .then(() => this.storage.set('ion_did_tutorial', true));
    }
  }

  ionViewWillEnter() {
    this.storage.get('ion_did_tutorial').then(res => {
      if (res === true) {
        this.router.navigateByUrl('/app/tabs/error-logs', { replaceUrl: true });
      }
    });

    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  async displayMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Display for 2 seconds
      position: 'bottom'
    });
    toast.present();
  }

  checkCheckboxes() {
    const allChecked = this.checkboxes.every(checkbox => checkbox.checked);
    if (allChecked) {
      this.displayMessage('All checkboxes have been checked. You can continue.');
    } else {
      this.displayMessage('Please check all checkboxes.');
    }
  }
}
