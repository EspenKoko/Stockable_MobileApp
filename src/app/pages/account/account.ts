import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController, IonModal, NavController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/users';
import { AuthenticationService } from '../../services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuditTrailService } from '../../services/audit-trail.service';
import { GeneralServices } from '../../services/general-services';
import { CustomValidators } from '../../providers/custom-validators';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements OnInit {
  username: string = "No Name";
  Image?: String;
  fileToUpload?: File;
  base64ImageData: string | null = null;
  Token: any;

  isLoading: boolean = false;
  updateForm: FormGroup;
  userData!: User;

  fileNameUploaded = '';
  formData = new FormData();

  constructor(public service: AuthenticationService,
    public alertCtrl: AlertController,
    private storage: Storage,
    public router: Router,
    public userData2: UserData,
    private ATService: AuditTrailService,
    private generalService: GeneralServices,
    private fb: FormBuilder,
    private navCtrl: NavController
  ) {
    // Create the updateForm and set the initial values
    this.updateForm = this.fb.group({
      userFirstName: ['', [Validators.required, CustomValidators.checkForWhiteSpace()]],
      userLastName: ['', [Validators.required, CustomValidators.checkForWhiteSpace()]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      userType: [''],
      confirmPassword: [''],
      newPassword: [''],
      currentPassword: [''],
      role: [''],
      profilePicture: [null],
    });
  }

  async ngOnInit(): Promise<void> {
    this.Token = await this.storage.get('Token');
    this.initializeUser();
  }

  initializeUser() {
    this.isLoading = true;
    this.service.getUser(this.Token.id).subscribe({
      next: (result: any) => {
        this.isLoading = false;
        this.username = result.userFirstName;
        this.Image = result.profilePicture;
      },
      error: (error: any) => {
        this.isLoading = false;

        console.error('Error fetching user data:', error);
      }
    });
  }

  // for using the file selector in html
  openFileInput(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior
    const fileInput = document.getElementById('file') as HTMLInputElement;
    fileInput.click(); // Trigger file input click event
  }

  uploadFile = (files: any) => {
    this.fileToUpload = <File>files[0];

    //for displaying image in modal
    const reader = new FileReader();
    reader.onload = () => {
      this.base64ImageData = reader.result as string; // Store the base64 data
    };
    reader.readAsDataURL(this.fileToUpload); // Read the file as base64

    // for sending image to api
    this.formData.append('profilePicture', this.fileToUpload, this.fileToUpload.name);

    //for display in html
    this.fileNameUploaded = this.fileToUpload.name
  }

  @ViewChild('file') fileInput!: ElementRef<HTMLInputElement>;

  clearChanges() {
    // Clear the file input value
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    // Clear other data
    this.clearData();
    this.fileNameUploaded = "";
    this.base64ImageData = null;
    this.fileToUpload = undefined;
  }

  @ViewChild(IonModal) modal: IonModal;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
  }

  changeProfilePicture() {
    //update profile photo
    this.isLoading = true;
    this.service.updateUserAccount(this.Token.id, this.formData).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        this.isLoading = false;
        if (response.status == 200) {
          // save audit trail
          this.ATService.trackActivity(`Profile picture updated for ${this.Token.user}`);

          this.cancel();
          this.clearChanges();
          this.initializeUser();
          this.generalService.presentToast('Profile picture updated', 5000);
        }
        else {
          this.generalService.presentToast('Failed to update profile picture, please try again later', 5000);
        }
      }
    });
  }

  removeProfilePicture() {
    this.updateForm.get('profilePicture')?.setValue(null);

    this.isLoading = true;
    this.service.removeProfilePicture(this.Token.id, this.updateForm.value).subscribe({
      next: (result: any) => { },
      error: (response: HttpErrorResponse) => {
        this.isLoading = false;
        if (response.status == 200) {
          // save audit trail
          this.ATService.trackActivity(`Profile picture removed for ${this.Token.user}`);

          this.clearChanges();
          this.initializeUser();
          this.generalService.presentToast('Profile picture removed', 5000);
        }
        else {
          this.generalService.presentToast('Failed to remove profile picture, please try again later', 5000);
        }
      }
    });
  }

  clearData() {
    this.formData.delete("userFirstName");
    this.formData.delete("userLastName");
    this.formData.delete("userType");
    this.formData.delete("email");
    this.formData.delete("phoneNumber");
    this.formData.delete("currentPassword");
    this.formData.delete("oldPassword");
    this.formData.delete("profilePicture");
  }

  logout() {
    this.userData2.logout();
    this.router.navigateByUrl('/login');
  }

  doRefresh(event) {
    // Reload the page with the animation
    this.navCtrl.navigateRoot('/account', { animationDirection: 'forward' });
    this.initializeUser();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
