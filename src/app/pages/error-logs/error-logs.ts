import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config, NavController } from '@ionic/angular';

import { ErrorLogsFilterPage } from '../error-logs-filter/error-logs-filter';
import { UserData } from '../../providers/user-data';
import { Repair } from '../../models/repairs';
import { RepairService } from '../../services/repair.service';
import { ErrorLogService } from '../../services/error-log.service';
import { ErrorLog } from '../../models/errorLogs';
import { AssignedTechnician } from '../../models/assignedTechnician';
import { AssignedTechnicianService } from '../../services/assigned-technician.service';
import { Storage } from '@ionic/storage-angular';
import { error } from 'cypress/types/jquery';
@Component({
  selector: 'page-error-logs',
  templateUrl: 'error-logs.html',
  styleUrls: ['./error-logs.scss'],
})
export class ErrorLogsPage implements OnInit {
  // Gets a reference to the list element
  @ViewChild('error-logs', { static: true }) errorlogsList: IonList;

  Token: any;
  data: any[] = [];

  constructor(
    private storage: Storage,
    private errorLogService: ErrorLogService,
    private assignedTechnicianService: AssignedTechnicianService,
    private navCtrl: NavController
  ) {
    this.GetErrorLogs();
  }

  ngOnInit() {
    this.GetErrorLogs();
  }

  GetErrorLogs() {
    // Retrieve the token from storage
    this.storage.get('Token').then((token) => {
      if (token) {
        // Use the token to filter error logs
        this.assignedTechnicianService.getAssignedTechnicians().subscribe((result: AssignedTechnician[]) => {
          const assignedTechnicians = result.filter(x => x.employee.userId == token.id);

          this.errorLogService.getErrorLogs().subscribe((result: ErrorLog[]) => {
            // Filter the error logs based on assignedTechnicians
            this.data = result.filter(x => assignedTechnicians.some(t => t.errorLogId == x.errorLogId && x.errorLogStatusId == 4));
            console.log(this.data, this.data.length)
          })
        });
      } else {
        console.error('Token not found in storage');
      }
    });
  }

  doRefresh(event) {
    // Reload the page with the animation
    this.navCtrl.navigateRoot('/app/tabs/error-logs', { animationDirection: 'forward' });
    this.GetErrorLogs();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

}

