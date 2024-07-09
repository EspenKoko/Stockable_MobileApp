import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class GeneralServices {
    public notFound: boolean = true;

    constructor(private toastCtrl: ToastController, private storage: Storage) {
    }

    public async getToken(): Promise<any> {
        const Token = await this.storage.get("Token");
        return Token;
    }

    public async presentToast(message: string, duration: number) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: duration,
            position: 'bottom',
            buttons: [
                {
                  text: 'Close',
                  role: 'cancel',
                },
              ],
        });
        toast.present();
    }

    // convert to base64
    public getImageAsBase64(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(xhr.response);
                } else {
                    reject('Failed to load image');
                }
            };
            xhr.send();
        });
    }

    //get todays date and timestamp
    public getDate() {
        // Date object
        const date = new Date();
        let currentDay = String(date.getDate()).padStart(2, '0');
        let currentMonth = String(date.getMonth() + 1).padStart(2, '0');
        let currentYear = date.getFullYear();
        // let currentTime = date.getTime();

        // we will display the date as DD-MM-YYYY
        let currentDate = `${currentDay}-${currentMonth}-${currentYear}`; //-${currentTime}`;
        return currentDate;
    }

    // handle reporting 404 errors
    public handleOrdersError(error: any) {
        if (error.status === 404) {
            this.notFound = true;
        } else {
            console.error("Error loading data:", error);
        }
        return of([]); // Return an empty array to continue with the rest of the logic
    }

    // used for reading formdata which is used in user-account.component and the pdf-help-doc.component
    public formDataToPlainObject(formData: FormData): any {
        console.log(formData);
        const obj: any = {};
        formData.forEach((value, key) => {
            obj[key] = value;
        });
        console.log(obj);
        return obj;
    }
}