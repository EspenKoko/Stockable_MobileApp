import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuditTrailService } from '../../services/audit-trail.service';
import { AuthenticationService } from '../../services/authentication.service';
import { GeneralServices } from '../../services/general-services';
import { CustomValidators } from '../../providers/custom-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'page-account-update',
  templateUrl: 'account-update.html',
  styleUrls: ['./account-update.scss'],
})
export class AccountUpdatePage implements OnInit {
  isLoading: boolean = false;
  emailSent: Boolean = false;
  updateForm: FormGroup;
  userData: any;

  constructor(private service: AuthenticationService,
    private ATService: AuditTrailService,
    private router: Router,
    private fb: FormBuilder,
    private generalService: GeneralServices
  ) {
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
    await this.GetUser();
  }

  async GetUser() {
    //get logged in user data
    this.isLoading = true;
    this.service.getUser((await this.generalService.getToken()).id).subscribe({
      next: (result: any) => {
        this.userData = result;
        // Set the initial values for the updateForm once userData is available
        this.updateForm.patchValue({
          userFirstName: this.userData?.userFirstName || '',
          userLastName: this.userData?.userLastName || '',
          email: this.userData?.email || '',
          userType: this.userData?.userType || '',
          role: this.userData?.role || '',
          phoneNumber: this.userData?.phoneNumber || '',
          // profilePicture: this.userData?.profilePicture || ''
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  refresh() {
    window.location.reload();
  }


  async updateUser() {
    //update all account details
    this.isLoading = true;
    this.service.updateUser((await this.generalService.getToken()).id, this.updateForm.value).subscribe({
      next: (result: any) => { },
      error: async (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status === 200) {
          // save audit trail
          this.ATService.trackActivity(`Account updated for ${(await this.generalService.getToken()).user}`);

          this.back().then((navigated: boolean) => {
            if (navigated) {
              this.refresh();
              this.generalService.presentToast('Account updated succesfully', 5000);
            }
          })
        }
        else if (error.status === 409) {
          this.generalService.presentToast('Email is already in use', 5000);
        }
        else {
          console.log(error.error)
          this.generalService.presentToast('error.error', 5000);
        }
      }
    })
  }

  back() {
    return this.router.navigateByUrl('/account')
  }
}
