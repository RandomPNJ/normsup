import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-group-card',
  templateUrl: './dash-group-card.component.html',
  styleUrls: ['./dash-group-card.component.scss']
})
export class DashGroupCardComponent implements OnInit {

  public reminders: Array<any> = [];
  cookieValue: any;

  constructor(private httpService: HttpService, private cookieService: CookieService,
	private router: Router) { }

  ngOnInit() {
	const allCookies: {} = this.cookieService.getAll();
    this.httpService.get('/api/suppliers/groups/reminders?type=NOTEMPTY')
      .subscribe(res => {
        if(res.body && res.body['items']) {
          this.getReminderData(res.body['items']);
        }
      }, err => {
        console.log('[DashGroupCardComponent] Error on get documents details');
      })
    ;
  }


  getReminderData(data) {
		data.forEach(reminder => {
			reminder.daysUntil = this.dayUntil(this.toTimestamp(reminder.next_reminder));
		});
    this.reminders = data;
  }

  dayUntil(timestamp) {
		let todateSec = new Date(timestamp * 1000);
		let fromdateSec = new Date();

		// if (todateSec < fromdateSec)
			// alert('To date must be grater that from date!');

		// Calculate days between dates
		let millisecondsPerDay = 86400 * 1000; // Day in milliseconds
		fromdateSec.setHours(0, 0, 0, 1); // Start just after midnight
		todateSec.setHours(23, 59, 59, 999); // End just before midnight
		let diff = todateSec.getTime() - fromdateSec.getTime(); // Milliseconds between datetime objects 
		let days = Math.ceil(diff / millisecondsPerDay);

		// Subtract two weekend days for every week in between
		let weeks = Math.floor(days / 7);
		days = days - (weeks * 2);

		// Handle special cases
		let fromdateDay = fromdateSec.getDay();
		let todateDay = todateSec.getDay();

		// Remove weekend not previously removed. 
		if (fromdateDay - todateDay > 1)
			days = days - 2;

		// Remove start day if span starts on Sunday but ends before Saturday
		if (fromdateDay == 0 && todateDay != 6)
			days = days - 1;

		// Remove end day if span ends on Saturday but starts after Sunday
		if (todateDay === 6 && fromdateDay !== 0) {
			days = days - 1;
		}
		let leaveDays = days;
		//@ts-ignore
		if (leaveDays === 'NaN' || leaveDays === '' || leaveDays <= '0' || leaveDays == 'undefined') {
			//@ts-ignore
			leaveDays = '';
		} else {
			leaveDays = days;
		}

		return days;
  }
  
  public addDays = function(days) {
		var date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	}

	public toTimestamp(strDate){
		var datum = Date.parse(strDate);
		return datum/1000;
	}

	public goToGroupDetails(id) {
		console.log('here', id)
		this.router.navigate(['dashboard', 'groups', 'details', id]);
	}

}
