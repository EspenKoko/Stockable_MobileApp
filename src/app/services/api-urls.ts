import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralServices } from './general-services';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private generalService: GeneralServices,
    private router: Router) {

  }

  //for testing purposes with assignment 3 code in acs store and initial authenticaiton service
  // apiUrl = 'http://localhost:5240/api/'

  //less secure port
  // apiUrl = 'https://localhost:7285/api/';
  // apiUrl = 'http://stockablebackend-dev.eba-cpqfkb7g.af-south-1.elasticbeanstalk.com/api/';

  //more secure port
  apiUrl = 'https://localhost:44378/api/';

  //handle based on status code for delete api calls
  handleApiDeleteReponse(response: HttpErrorResponse, object?: any, id?: number) {
    console.log(response)
    if (response.status == 200) {
      if (object == null && id == null) {
        window.location.reload();
      }
      else {
        // object = object.filter((item: any | undefined) => item.id !== id);
      }
    }
    else if (response.status == 400) {
      this.generalService.presentToast(response.error.text, 5000);
    }
    else if (response.status == 404) {
      this.generalService.presentToast(response.error.text, 5000);
    }
    else if (response.status == 500) {
      this.generalService.presentToast(response.error.text, 5000);
    }
    else {
      this.generalService.presentToast(response.error.text, 5000);
    }
  }

  //handle based on status code for delete api calls
  handleApiPutReponse(response: HttpErrorResponse, name: string) {
    console.log(response)
    if (response.status == 200) {
      let urlName: string = name.toLowerCase();
      this.router.navigate([`/view-${urlName}`]).then((navigated: boolean) => {
        if (navigated) {
          let successName: string = name.charAt(0).toUpperCase() + name.slice(1, name.length)
          this.generalService.presentToast(`${successName} Successfully Updated`, 5000);
        }
      })
    }
    else if (response.status == 400) {
      this.generalService.presentToast(response.error, 5000);
    }
    else if (response.status == 404) {
      this.generalService.presentToast(response.error, 5000);
    }
    else if (response.status == 500) {
      this.generalService.presentToast(response.error, 5000);
    }
    else if (response.status == 501) {
      this.generalService.presentToast(response.error, 5000);
    }
    else {
      this.generalService.presentToast(response.error, 5000);
    }
  }

  //handle based on status code for delete api calls
  handleApiPostReponse(response: HttpErrorResponse, name: string) {
    console.log(response)
    if (response.status == 200) {
      let urlName: string = name.toLowerCase();
      this.router.navigate([`/view-${urlName}`]).then((navigated: boolean) => {
        if (navigated) {
          let successName: string = name.charAt(0).toUpperCase() + name.slice(1, name.length)
          this.generalService.presentToast(`${successName} Successfully Added`, 5000);
        }
      })
    }
    else if (response.status == 400) {
      this.generalService.presentToast(response.error, 5000);
    }
    else if (response.status == 404) {
      this.generalService.presentToast(response.error, 5000);
    }
    else if (response.status == 500) {
      this.generalService.presentToast(response.error, 5000);
    }
    else if (response.status == 501) {
      this.generalService.presentToast(response.error, 5000);
    }
    else {
      this.generalService.presentToast(response.error, 5000);
    }
  }
}