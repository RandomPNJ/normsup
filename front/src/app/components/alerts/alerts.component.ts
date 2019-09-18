import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  @ViewChild('selectSupp') public selectSupp: TemplateRef<any>;
  subscriptions: Subscription[] = [];
  modalRef: BsModalRef;
  modalConfig = {
    animated: true,
    class: 'modal-dialog-centered'
  };
  preferences: any = {
    alertState: true,
    alertValidSup: false,
    alertInvalidSup: true,
    alertInvalidMail: true,
    alertFrequency: 'EVERYOTHERDAY'
  };
  frequency: Array<any> = [
    { name : ' ', value: ' '},
    { name: 'Journalière', value: 'DAILY'},
    { name: 'Un jour sur deux', value: 'EVERYOTHERDAY'},
    { name: 'Hebdomadaire', value: 'WEEKLY'},
  ];

  constructor(private modalService: BsModalService, private changeDetection: ChangeDetectorRef,
    private settingService: SettingsService) { }

  ngOnInit() {
  }

  openModal() {
    const _combine = combineLatest(
      this.modalService.onShow,
      this.modalService.onShown,
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHidden.subscribe(() => {
        this.unsubscribe();
      })
    );

    const config = cloneDeep(this.modalConfig);
    this.subscriptions.push(_combine);
    // if(modalType !== 'Supplier' && modalType !== 'AddDoc') {
    //   config.class += ' modal-lg';
    // }
    this.modalRef = this.modalService.show(this.selectSupp, config);
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  hideModal() {
    if (!this.modalRef) {
      return;
    }
    this.modalService.hide(1);
    this.modalRef = null;
  }

  updatePreferences() {
    if(this.preferences) {
      this.settingService
        .updateAlertSettings('/api/alerts/manage', this.preferences)
        .pipe(map(res => {
          console.log('res ==', res);
          return res;
        }))
      ;
    }

  }
}
