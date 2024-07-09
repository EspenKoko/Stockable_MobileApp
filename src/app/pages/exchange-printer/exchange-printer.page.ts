import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ErrorLog } from '../../models/errorLogs';
import { AssignedPrinter } from '../../models/AssignedPrinters';
import { BranchService } from '../../services/branch.service';
import { AssignedPrinterService } from '../../services/assigned-printer.service';
import { ErrorLogService } from '../../services/error-log.service';
import { Branch } from '../../models/branches';
import { ToastController } from '@ionic/angular'; // Import ToastController from Ionic
import { TransitPrinterService } from '../../services/transit-printer';
import { Storage } from '@ionic/storage-angular';
import { GeneralServices } from '../../services/general-services';


@Component({
  selector: 'exchange-printer',
  templateUrl: 'exchange-printer.page.html',
  styleUrls: ['./exchange-printer.page.scss'],
})

export class ExchangePrinterPage implements OnInit {
  data!: ErrorLog;
  branchData: any; // Type branch
  printerData: AssignedPrinter[] = [];
  printerSelection: any = null;
  assignedPrinterId: any;
  printer: any;
  attribute: any;
  errorLogData: any;
  transitPrinterData: any;
  Token: any;
  printerToExchange: any;

  constructor(
    private branchService: BranchService,
    private assignedPrinterService: AssignedPrinterService,
    private errorLogService: ErrorLogService,
    private router: Router,
    private storage: Storage,
    private route: ActivatedRoute,
    private transitPrinterService: TransitPrinterService,
    private toastController: ToastController,
    private generalService: GeneralServices
  ) {

  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    await this.getBranch();
    await this.getPrinters();
    this.getUserData();
    this.getErrorlog();
    this.getTransitPrinter();
  }

  getUserData() {
    this.storage.get('Token').then((token) => {
      this.Token = token;
    });
  }

  getErrorlog() {
    this.errorLogService.getErrorLog(this.data.errorLogId).subscribe((result: any) => {
      this.errorLogData = result
    })
  }

  getTransitPrinter() {
    this.transitPrinterService.getTransitPrinters().subscribe((result: any) => {
      this.transitPrinterData = result.find(x => x.technicianId === this.Token.id && x.errorLogId === this.data.errorLogId);

      this.assignedPrinterService.getAssignedPrinter(this.transitPrinterData.assignedPrinterId).subscribe((result: any) => {
        this.printerToExchange = result;
        console.log("printerToExchange", this.printerToExchange)
      })
    });
  }


  async loadData(): Promise<void> {
    try {
      const result: any = await firstValueFrom(this.errorLogService.getErrorLog(+this.route.snapshot.params['errorLogId']));
      this.data = result;
    } catch (error) {
      this.presentToast("Error loading data: " + error);
    }
  }

  async getBranch() {
    try {
      const data = await firstValueFrom(this.branchService.getBranches());
      this.branchData = data.find((branch: Branch) => branch.assignedPrinterId === this.data?.assignedPrinterId);
      console.log("Branch", this.branchData)
    } catch (error) {
      this.presentToast("Error loading branch information: " + error);
    }
  }

  async getPrinters() {
    try {
      const result = await firstValueFrom(this.assignedPrinterService.getAssignedPrinters());
      let data = result.filter((printer: AssignedPrinter) => printer.clientId == this.branchData?.clientId);
      this.printerData = data.filter((printer: AssignedPrinter) => printer.assignedPrinterId != this.data?.assignedPrinterId && printer.printerStatusId == 3);
    } catch (error) {
      this.presentToast("Error loading printer information: " + error);
    }
  }

  exchange() {
    this.branchData.assignedPrinterId = this.printerToExchange.assignedPrinterId;

    this.branchService.editBranch(this.branchData.branchId, this.branchData).subscribe({
      next: (result: any) => { },
      error: async (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.printerToExchange.printerStatusId = 1;
          this.assignedPrinterService.editAssignedPrinter(this.printerToExchange.assignedPrinterId, this.printerToExchange).subscribe({
            next: (result: any) => { },
            error: async (response: HttpErrorResponse) => {
              if (response.status == 200) {
                this.errorLogData.errorLogStatusId = 5;

                this.errorLogService.editErrorLog(this.errorLogData.errorLogId,this.errorLogData).subscribe({
                  next: (result: any) => { },
                  error: async (response: HttpErrorResponse) => {
                    if (response.status == 200) {
                      this.back().then((navigated: boolean) => {
                        if (navigated) {
                          this.generalService.presentToast("Successfully exchanged printer", 5000)
                        }
                      });
                    }
                    else{
                      this.generalService.presentToast("Falided to update Errorlog", 5000)
                    }
                  }
                })
              }
              else{
                this.generalService.presentToast("Falided to update printer status", 5000)
              }
            }
          })
        }
        else{
          this.generalService.presentToast("Falided to updated branch", 5000)
        }
      }
    });
  }

  editBranch() {
    if (this.printerSelection) {
      let updatedBranchPrinter: Branch = this.branchData;

      this.errorLogData.errorLogStatusId = 5;

      updatedBranchPrinter.assignedPrinterId = this.printerSelection.assignedPrinterId;
      this.branchService.editBranch(updatedBranchPrinter.branchId, updatedBranchPrinter).subscribe({
        next: (result: any) => { },
        error: async (response: HttpErrorResponse) => {
          if (response.status == 200) {
            updatedBranchPrinter.assignedPrinter.printerStatusId = 1;
            updatedBranchPrinter.assignedPrinter.serialNumber = this.printerSelection.serialNumber;

            this.assignedPrinterService.editAssignedPrinter(updatedBranchPrinter.assignedPrinterId, updatedBranchPrinter.assignedPrinter).subscribe({
              next: (result: any) => { },
              error: async (response: HttpErrorResponse) => {
                if (response.status == 200) {
                  this.errorLogService.editErrorLog(this.errorLogData.errorLogId, this.errorLogData).subscribe({
                    next: (result: any) => { },
                    error: async (response: HttpErrorResponse) => {
                      if (response.status == 200) {
                        this.router.navigate(['home']).then(async (navigated: boolean) => {
                          if (navigated) {
                            await this.presentToast(`Printer at branch ${updatedBranchPrinter.branchCode} has been exchanged and updated on the system`);
                          }
                        });
                      } else {
                        await this.presentToast("Could not Update printer status: " + response.error);
                      }
                    }
                  });
                }
              }
            });
          } else {
            await this.presentToast("Could not exchange printer: " + response.error);
          }
        }
      });
    } else {
      this.presentToast("Please make a printer selection for exchange");
    }
  }
  // Function to present a toast
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

  back() {
    return this.router.navigate(["error-logs"]);
  }
}