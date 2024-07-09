import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignedPrinter } from '../../models/AssignedPrinters';
import { ErrorLog } from '../../models/errorLogs';
import { ApiService } from '../../services/api-urls';
import { AssignedPrinterService } from '../../services/assigned-printer.service';
import { ErrorLogService } from '../../services/error-log.service';
import { ToastController } from '@ionic/angular'; // Import ToastController from Ionic
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'page-infield-checklist',
  templateUrl: 'infield-checklist.html',
  styleUrls: ['./infield-checklist.scss'],
})
export class InfieldChecklist implements OnInit {
  rerouted: Boolean;
  data: any;
  errorLogData: any;
  remoteChecklist: FormGroup;
  printerData: any[] = [];
  snackBarText: string;

  constructor(
    private router: Router,
    private service: ErrorLogService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private printerService: AssignedPrinterService,
    private apiService: ApiService,
    private toastController: ToastController, // Inject ToastController
    private authService: AuthenticationService
  ) {
    this.service.getErrorLog(+this.route.snapshot.params['errorLogId']).subscribe((result: any) => {
      this.errorLogData = result;
    });

    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['fromExchangePrinterComponent']) {
      // Navigated from the ExchangePrinterComponent
      console.log('Navigated from ExchangePrinterComponent');
      this.rerouted = true;
      this.snackBarText = "resubmited";
    } else {
      // Navigated from a different URL
      console.log('Navigated from a different URL');
      this.rerouted = false;
      this.snackBarText = "completed";
    }

    this.remoteChecklist = this.fb.group({
      Restarted: [false, Validators.required],
      NetworkCheck: [false, Validators.required],
      PrinterCleaned: [false, Validators.required],
      IndentCatridgeViable: [false, Validators.required],
      PrintingFoilViable: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      // Get the logged-in user's ID from the authentication service
      this.data = this.authService.getLoggedInUserId();
    } else {
      // Handle the case where the user is not authenticated
      console.error('User is not authenticated.');
    }
    console.log(this.data);
    this.getPrinters();
    this.checkState();
  }

  //check whether the user routed to the page from the dashboard or rerouted from parts request
  checkState() {
    if (this.rerouted) {
      this.remoteChecklist.setValue({
        Restarted: true,
        NetworkCheck: true,
        PrinterCleaned: true,
        IndentCatridgeViable: true,
        PrintingFoilViable: true,
      });
    }
  }

  getPrinters() {
    this.printerService.getAssignedPrinters().subscribe((result: any[]) => {
      this.printerData = result.filter(x => x.printerStatusId == 2);
    });
  }

  // Handle printer fixed scenario
  printerFixed() {
    this.service.getErrorLog(this.errorLogData.errorLogId).subscribe((errorlog: any) => {
      let errorLogData: ErrorLog = errorlog;
      errorLogData.errorLogStatusId = 2;
      this.service.editErrorLog(this.errorLogData.errorLogId, errorLogData).subscribe({
        next: (result: any) => { },
        error: (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.printerService.getAssignedPrinters().subscribe((printers: AssignedPrinter[]) => {
              let printer = printers.find(x => x.assignedPrinterId == errorLogData.assignedPrinterId);

              // set printer as online again
              if (printer) {
                printer.printerStatusId = 1;
                this.printerService.editAssignedPrinter(printer.assignedPrinterId, printer).subscribe({
                  next: (result) => { },
                  error: (response: HttpErrorResponse) => {
                    if (response.status == 200) {
                      this.router.navigateByUrl('/app/tabs/error-logs').then((navigated: boolean) => {
                        if (navigated) {
                          window.location.reload();
                          setTimeout(() => {
                            this.presentToast("The printer is now back to normal and can be used for printing");
                          }, 500);
                        }
                      });
                    }
                    else {
                      this.presentToast("An error has occured");
                    }
                  }
                });
              }
            });
          }
          else {
            this.apiService.handleApiDeleteReponse(response);
          }
        }
      });
    });
  }

  printerNotFixed() {
    // Get the form control values from the FormGroup
    const formValues = this.remoteChecklist.value;

    // Check if all boolean attributes in the form are true
    const allTrue = Object.values(formValues).every(value => value === true);

    if (allTrue) {
      console.log('All checklist items are marked as true.');
      this.router.navigate(['exchange-printer/' + this.errorLogData.errorLogId]).then((navigated: boolean) => {
        if (navigated) {
          this.presentToast("Diagnostics " + this.snackBarText + ". Please replace printer");
        }
      });
    } else {
      this.presentToast("Please ensure you have assessed every item in the checklist");
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
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
}