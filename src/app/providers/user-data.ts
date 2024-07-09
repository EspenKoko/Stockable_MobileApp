import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class UserData {
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public storage: Storage
  ) { }

  async login(): Promise<any> {
    await this.storage.set(this.HAS_LOGGED_IN, true);
    return window.dispatchEvent(new CustomEvent('user:login'));
  }

  async logout(): Promise<any> {
    await this.storage.remove(this.HAS_LOGGED_IN);
    await this.storage.remove('Token');
    window.dispatchEvent(new CustomEvent('user:logout'));
  }

  async isLoggedIn(): Promise<boolean> {
    const value = await this.storage.get(this.HAS_LOGGED_IN);
    return value === true;
  }

  async checkHasSeenTutorial(): Promise<string> {
    const value = await this.storage.get(this.HAS_SEEN_TUTORIAL);
    return value;
  }
}
