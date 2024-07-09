import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage implements OnInit{
  role: any[] = []

  constructor(private storage: Storage) {

  }

  async ngOnInit(): Promise<void> {
    console.log((await this.storage.get("Token")).role)
    this.role = (await this.storage.get("Token")).role;
  }

}
