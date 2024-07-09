import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

import { UserData } from '../../providers/user-data';

import { HttpErrorResponse } from '@angular/common/http';
import { AuditTrailService } from '../../services/audit-trail.service';
import { AuthenticationService } from '../../services/authentication.service';
import { CustomValidators } from '../../providers/custom-validators';
import { GeneralServices } from '../../services/general-services';
import { AppComponent } from '../../app.component';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  updatePasswordForm: FormGroup;
  updateForm: FormGroup;
  isLoading: boolean;

  constructor(public service: AuthenticationService,
    private ATService: AuditTrailService,
    public appComponent: AppComponent,
    public userData: UserData,
    private storage: Storage,
    public router: Router,
    private fb: FormBuilder,
    private generalService: GeneralServices
  ) {
    this.loginForm = this.fb.group({
      emailaddress: ['', Validators.email],
      password: ['', Validators.required]
    });

    // Create the updateForm and set the initial values
    this.updateForm = this.fb.group({
      userFirstName: [{ value: '', disabled: true }, [Validators.required, CustomValidators.checkForWhiteSpace()]],
      userLastName: [{ value: '', disabled: true }, [Validators.required, CustomValidators.checkForWhiteSpace()]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      userType: [''],
      confirmPassword: [''],
      newPassword: [''],
      currentPassword: [''],
      role: [''],
      profilePicture: [null],
    });

    this.updatePasswordForm = this.fb.group({
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

  async ngOnInit(): Promise<void> {

  }

  async testLogin1() {
    this.userData.login();
    const result = {
      id: "test",
      userName: "clerk@gmail.com",
      firstName: "Clerk",
      lastName: "User",
      type: "Employee",
      phoneNumber: "0000000000",
      profilePicture: null,
      token: null,
      role: "INVENTORY_CLERK"
    }
    await this.storage.set('Token', result);

    this.router.navigateByUrl('/app/tabs/home').then((navigated: boolean) => {
      if (navigated) {
        window.location.reload();
        setTimeout(() => {
          this.generalService.presentToast(`Welcome back`, 5000);
        }, 500);
      }
    });
  }

  async testLogin2() {
    this.userData.login();
    const result = {
      id: "test",
      userName: "techguy@gmail.com",
      firstName: "techguy",
      lastName: "User",
      type: "Employee",
      phoneNumber: "0000000000",
      profilePicture: null,
      token: null,
      role: "TECHNICIAN"
    }
    await this.storage.set('Token', result);

    this.router.navigateByUrl('/app/tabs/home').then((navigated: boolean) => {
      if (navigated) {
        window.location.reload();
        setTimeout(() => {
          this.generalService.presentToast(`Welcome back`, 5000);
        }, 500);
      }
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.service.login(this.loginForm.value).subscribe({
        next: async (result: any) => {
          this.isLoading = false;

          this.userData.login()

          try {
            await this.storage.set('Token', result);
            console.log(await this.storage.get("Token"));
          } catch (error) {
            console.error('Error storing data:', error);
          }

          this.ATService.trackActivity("Logged in");

          // Get the user roles from the result
          const userRoles: string[] = result.role;

          const username = result.firstName;

          // Check the user roles and redirect accordingly
          if (userRoles.includes('TECHNICIAN')) {
            // Redirect to the client admin dashboard
            this.router.navigateByUrl('/app/tabs/home').then((navigated: boolean) => {
              if (navigated) {
                window.location.reload();
                setTimeout(() => {
                  this.generalService.presentToast(`Welcome back ${username}`, 5000);
                }, 500);
              }
            });
          }
          else if (userRoles.includes('INVENTORY_CLERK')) {
            this.router.navigateByUrl('/app/tabs/home').then((navigated: boolean) => {
              if (navigated) {
                window.location.reload();
                setTimeout(() => {
                  this.generalService.presentToast(`Welcome back ${username}`, 5000);
                }, 500);
              }
            });
          }
          else if (userRoles.includes('SUPER_ADMIN')) {
            this.router.navigate(['/app/tabs/home']).then((navigated: boolean) => {
              if (navigated) {
                window.location.reload();
                setTimeout(() => {
                  this.generalService.presentToast(`You are a super user. certain funtionality may not work`, 5000);
                }, 500)
              }
            });
          }
          else {
            this.generalService.presentToast(`Unauthorised`, 5000);
          }
        },
        error: (response: HttpErrorResponse) => {
          this.isLoading = false;

          // Handle error responses
          if (response.status === 403 || response.status === 404 || response.status === 500) {
            this.generalService.presentToast(response.error, 5000);
          }
          else {
            this.generalService.presentToast(`Error logging in please try again ${response.status} ${response.error}`, 5000);

          }
        }
      });
    }
    else {
      this.generalService.presentToast(`Something went wrong`, 5000);
    }
  }

  forgotPassword() {
    let email = '';
    // let email = this.Token.user;
    // this.isLoading = true;
    this.service.updateUser(email, this.updatePasswordForm.value).subscribe({
      next: (Result: any) => { },
      error: (response: HttpErrorResponse) => {
        // this.isLoading = false;
        if (response.status === 200) {
          // save audit trail
          this.ATService.trackActivity(`Password updated for ${email}`);
        }
        else if (response.status === 400) { //confirmed password does not match new password
          this.generalService.presentToast(response.error.errors.confirmPassword, 5000);
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

  navigate() {
    this.router.navigateByUrl('/app/tabs/home');
  }
}
