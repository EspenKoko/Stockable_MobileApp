import { Component, OnInit } from '@angular/core';
import { ErrorLogService } from '../../services/error-log.service';
import { AssignedTechnicianService } from '../../services/assigned-technician.service';
import { Storage } from '@ionic/storage-angular';
import { ErrorLog } from '../../models/errorLogs';
import { AssignedTechnician } from '../../models/assignedTechnician';

@Component({
  selector: 'page-landing-page',
  templateUrl: 'landing-page.html',
  styleUrls: ['./landing-page.scss'],
})
export class LandingPage implements OnInit {
  currentSec: number;
  seconds: number;
  minutes: number;
  hours: number;

  Token: any;
  data: any[] = [];
  user: string;

  constructor(private storage: Storage,
    private errorLogService: ErrorLogService,
    private assignedTechnicianService: AssignedTechnicianService) {
  }

  async ngOnInit(): Promise<void> {
    this.GetErrorLogs();
    this.user = (await this.storage.get("Token")).firstName

    this.currentSec = this.getSecondsToday();
    this.seconds = (this.currentSec / 60) % 1;
    this.minutes = (this.currentSec / 3600) % 1;
    this.hours = (this.currentSec / 43200) % 1;
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
          })
        });
      } else {
        console.error('Token not found in storage');
      }
    });
  }

  setTime(left: number, hand: string): void {
    // Implement your logic here to set the time for the given hand
    // You can manipulate CSS classes or use Angular animations.
  }

  getSecondsToday(): number {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = now.getTime() - today.getTime();
    return Math.round(diff / 1000);
  }
}