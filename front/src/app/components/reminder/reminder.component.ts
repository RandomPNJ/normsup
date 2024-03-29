import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { SettingsService } from 'src/app/services/settings.service';
import { HttpService } from 'src/app/services/http.service';
import { BrowserStorageService } from 'src/app/services/storageService';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {

  @ViewChild('selectSupp') public selectSupp: TemplateRef<any>;
  subscriptions: Subscription[] = [];
  modalRef: BsModalRef;
  modalConfig = {
    animated: true,
    class: 'modal-dialog-centered'
  };
  clientID: any;
  preferences: any = {
  };
  defaultPreferences : any = {
    alerts_state: true,
    alert_valid_sup: false,
    alert_invalid_sup: true,
    alert_invalid_mail: true,
    alert_frequency: 'EVERYOTHERDAY'
  };
  loading: Boolean = true;
  frequency: Array<any> = [
    { name : ' ', value: ' '},
    { name: 'Journalière', value: 'DAILY'},
    { name: 'Un jour sur deux', value: 'EVERYOTHERDAY'},
    { name: 'Hebdomadaire', value: 'WEEKLY'},
  ];

  constructor(private modalService: BsModalService, private changeDetection: ChangeDetectorRef,
    private settingService: SettingsService, private httpService: HttpService, private localStorage: BrowserStorageService) { }

  ngOnInit() {
    this.clientID = JSON.parse(this.localStorage.getLocalStorage('current_user')).id;
    this.httpService
      .get('/api/settings/alerts/' + this.clientID)
      .subscribe(res => {
        if(res.body['settings']) {
          this.preferences = res.body['settings'];
          Object.keys(this.preferences)
            .map(key => {
              if(key !== 'alertFrequency') {
                if(this.preferences[key] === 0) {
                  this.preferences[key] = false;
                } else if(this.preferences[key] === 1) {
                  this.preferences[key] = true;
                }
              }
            })
          ;
        } else {
          // No data found, TODO : make an error pop up
          this.preferences = cloneDeep(this.defaultPreferences);
        }
        this.loading = false;
      })
    ;
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
      this.preferences.clientID = JSON.parse(this.localStorage.getLocalStorage('current_user')).id;
      return this.httpService
        .post('/api/settings/alerts/manage', this.preferences)
        .subscribe(res => {
          // TODO: Make success pop up
          return;
        })
      ;
    }
  }
}
