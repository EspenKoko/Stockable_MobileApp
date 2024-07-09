import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuditTrailService } from '../../services/audit-trail.service';
import { AuthenticationService } from '../../services/authentication.service';
import { GeneralServices } from '../../services/general-services';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
  styleUrls: ['./change-password.scss'],
})
export class ChangePasswordPage {
  isLoading: boolean = false;
  emailSent: Boolean = false;
  changePasswordForm: FormGroup;

  constructor(private service: AuthenticationService,
    private ATService: AuditTrailService,
    private fb: FormBuilder,
    private router: Router,
    private generalService: GeneralServices
  ) {
    this.changePasswordForm = this.fb.group({
      userFirstName: [''],
      userLastName: [''],
      email: [''],
      phoneNumber: [''],
      userType: [''],
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!*()_-])[A-Za-z\d@#$%^&+=!*()_-]{8,}$/)]],
      confirmPassword: ['', Validators.required],
      role: [''],
      profilePicture: [null],
    }, {
      // Add custom validator to the form group
      // validator: CustomValidators.passwordMatchValidator
    });
  }

  async updateUser() {
    let email = (await this.generalService.getToken()).user;
    this.isLoading = true;
    console.log(this.changePasswordForm.value)
    this.service.updateUser(email, this.changePasswordForm.value).subscribe({
      next: (Result: any) => { },
      error: (response: HttpErrorResponse) => {
        this.isLoading = false;
        if (response.status === 200) {
          // save audit trail
          this.ATService.trackActivity(`Password updated for ${email}`);

          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.generalService.presentToast(`Password changed succesfully`, 5000);
            }
          })
        }
        else if (response.status === 400) { //confirmed password does not match new password
          this.generalService.presentToast(response.error.errors.confirmPasswor, 5000);
        }
        else if (response.status === 500) { //old password does not match db password
          this.generalService.presentToast(response.error, 5000);
        }
        else {
          console.error(response)
          this.generalService.presentToast(`Something went wrong. Please try again`, 5000);
        }
      }
    })
  }

  back() {
    return this.router.navigateByUrl('/account')
  }
}
