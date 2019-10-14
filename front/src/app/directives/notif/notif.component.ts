import { Component, OnInit, Input } from '@angular/core';

import { Alert, AlertType } from '../../models/notif';
import { NotifService } from '../../services/notif.service';

@Component({
    selector: 'notif',
    templateUrl: 'notif.component.html',
    styleUrls: ['./notif.component.scss']
})

export class NotifComponent {
    @Input() id: string;

    alerts: Alert[] = [];
    toFade = 0;
    timeout: any;
    constructor(private alertService: NotifService) { }

    ngOnInit() {
        this.alertService.getAlert(this.id).subscribe((alert: Alert) => {
            if (!alert.message) {
                // clear alerts when an empty alert is received
                this.alerts = [];
                return;
            }
            this.configureTimeout(alert);

            // add alert to array
            this.alerts.push(alert);
        });
    }

    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    configureTimeout(alert: Alert) {
        this.timeout = setTimeout(() => {
            this.removeAlert(alert);
        }, 2500);
    }

    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }

        // return css class based on alert type
        switch (alert.type) {
            case AlertType.Success:
                return 'alert alert-success';
            case AlertType.Error:
                return 'alert alert-danger';
            case AlertType.Info:
                return 'alert alert-info';
            case AlertType.Warning:
                return 'alert alert-warning';
        }
    }
}