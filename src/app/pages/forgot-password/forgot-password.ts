import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuditTrailService } from '../../services/audit-trail.service';
import { AuthenticationService } from '../../services/authentication.service';
import { GeneralServices } from '../../services/general-services';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPasswordPage {
  isLoading: boolean = false;
  emailSent: Boolean = false;
  resetForm: FormGroup;

  constructor(private service: AuthenticationService,
    private ATService: AuditTrailService,
    private fb: FormBuilder,
    private generalService: GeneralServices
  ) {
    this.resetForm = this.fb.group({
      email: [, [Validators.email]],
    })
  }

  sendResetPasswordLink(): void {
    if (this.resetForm.valid) {
      this.isLoading = true;
      this.service.forgetPassword(this.resetForm.value).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {
          this.isLoading = false;
          if (response.status == 200) {
            // save audit trail
            this.ATService.trackActivity(`Password reset link sent for ${this.resetForm.get('email')?.value}`);

            // this.resetForm.reset();
            this.emailSent = true;
            this.generalService.presentToast(`Password reset link has been sent`, 5000);
          }
          else if (response.status == 400) {
            this.generalService.presentToast(`User does not exist or email is incorrect`, 5000);
          }
          else {
            this.generalService.presentToast(`Request failed. please check internet or try again later`, 5000);
          }
        }
      });
    }
    else {
      this.generalService.presentToast(`Request failed. please check email address`, 5000);
    }
  }

}
