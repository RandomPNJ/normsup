import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef, Input } from '@angular/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { HttpService } from 'src/app/services/http.service';
import { NotifService } from 'src/app/services/notif.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {

  @ViewChild('deleteGroupModal') public deleteGroupModalRef: TemplateRef<any>;
  @ViewChild('modifyGroupModal') public modifyGroupModalRef: TemplateRef<any>;
  group$: Observable<any>;
  suppliers: any[] = [];
  subscriptions: Subscription[] = [];
  modalRef: BsModalRef;
  modalConfig = {
    animated: true,
    class: 'modal-dialog-centered modal-medium'
  };
  modalState: String = 'groupName';
  id: Number;
  activateReminders: Boolean = false;
  freq: any;
  typeModal: String = 'MODIFICATION';
  groupName: string;
  documentsSettings: any = {
    legal: {
      urssaf: false,
      lnte: false,
      kbis: false,
    },
    frequency: ''
  };
  compDocs: Array<any> = [
    { name: 'Complémentaire un', value: 'compone'},
    { name: 'Complémentaire deux', value: 'comptwo'},
  ];
  frequency: Array<any> = [
    // { name: '5 jours', value: '5d'},
    // { name: '7 jours', value: '7d'},
    { name: '15 jours', value: '15d'},
    { name: '30 jours', value: '30d'},
  ];
  itemPluralCount = {
    'suppliers': {
      '=0': '',
      '=1': '',
      'other': '#'
    }
  };
  itemPluralMapping = {
    'suppliers': {
      '=0': 'Vous n\'avez aucun fournisseur dans ce groupe.',
      '=1': 'Vous avez un fournisseur dans ce groupe.',
      'other': 'fournisseurs dans ce groupe'
    }
  };

  constructor(
    private modalService: BsModalService,
    private changeDetection: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private notif: NotifService
  ) { }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get("id"), 10);
    this.httpService.get('/api/suppliers/group/'+ this.id)
      .subscribe(res => {
        if(res.body && res.body['items']) {
          this.groupName = res.body['items'][0]['name'];
          this.activateReminders = !!res.body['items'][0];
          if(res.body['items'][0]['legal_docs'] !== "" && res.body['items'][0]['legal_docs'] !== null && res.body['items'][0]['legal_docs'] !== "null") {
            let legalSettings = res.body['items'][0]['legal_docs'].split('_');
            legalSettings.forEach(e => {
              if(e === 'u') {
                this.documentsSettings.legal.urssaf = true;
              }
              if(e === 'l') {
                this.documentsSettings.legal.lnte = true;
              }
              if(e === 'k') {
                this.documentsSettings.legal.kbis = true;
              }
            });
          }
          this.documentsSettings.frequency = res.body['items'][0]['frequency'] + 'd';
        }
      }, err => {
        console.log('err', err);
      })
    ;
    
    this.httpService.get('/api/suppliers/group/'+ this.id + '/members')
      .subscribe(res => {
        if(res.body && res.body['items']) {
          this.suppliers = res.body['items'];
        }
      }, err => {
      })
    ;
      
  }

  changeModal(action) {
    console.log('change Modal', action);
    if(action === 'hide') {
      this.hideModal();
    }
    if(action === 'MODIFICATION') {
      this.reloadMembers();
      this.hideModal();
    }
    if(action === 'groupMembers') {
      this.modalRef.setClass('modal-dialog-centered modal-extra');
    }
    if(action === 'groupName' || action === 'newDoc') {
      this.modalRef.setClass('modal-dialog-centered modal-sm');
    }
    if(action === 'docInfo') {
      this.modalRef.setClass('modal-dialog-centered modal-medium');
    }
  }

  openModal(type) {
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
    if(type === 'modify') {
      this.modalRef = this.modalService.show(this.modifyGroupModalRef, config);
    } else if(type === 'delete') {
      this.modalRef = this.modalService.show(this.deleteGroupModalRef, config);
    }
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
    this.modalState = 'groupName';
    this.modalRef = null;
  }

  private reloadMembers() {
    this.httpService.get('/api/suppliers/group/'+ this.id + '/members')
      .subscribe(res => {
        if(res.body && res.body['items']) {
          this.suppliers = res.body['items'];
        }
      }, err => {
      })
    ;
  }

  public save() {
    const data = {
      frequency: '',
      activated: 0,
      legal_docs: '',
      comp_docs: ''
    };
    data['group_id'] = this.id;
    data['activated'] = this.activateReminders ? 1 :  0;
    let i = 0;
    Object.keys(this.documentsSettings.legal).map((key, ind) => {
      if(this.documentsSettings.legal[key]) {
        if(i !== 0) {
          data['legal_docs'] += '_' + key.charAt(0).toLowerCase();
        } else {
          data['legal_docs'] = key.charAt(0).toLowerCase();
        }
        i++;
      }
    });
    // TODO: change this
    data['comp_docs'] = '';
    if(this.documentsSettings.frequency) {
      data['frequency'] = this.documentsSettings.frequency.substring(0, 2);
    }
    this.httpService.post('/api/suppliers/group/'+ this.id + '/modify_reminders', data)
      .subscribe(res => {
        this.notif.success('Paramètres modifiés avec succès.');
      }, err => {
        this.notif.error('Une erreur s\'est produite, veuillez réessayer.');
      })
    ;
  }

  public spontReminder() {
    let q = this.id ? this.id.toString() : '0';
    console.log('this.id', this.id);
    console.log('q', q);
    this.httpService.post('/api/reminders/group/' + q)
      .subscribe(res => {
        console.log('[spontReminder] res ', res);
      }, err => {
        console.log('[spontReminder] err ', err);
      })
    ;
  }

private changeGroupName(e) {
  if(e) {
    this.groupName = e;
  }
}
  private deleteGroup() {
    this.httpService.post('/api/suppliers/group/'+ this.id + '/delete')
      .subscribe(res => {
        console.log('res', res);
        this.router.navigate(['dashboard', 'groups', {action: 'deleted'}]);
        this.hideModal();
      }, err => {
        console.log('err', err);
        this.notif.error('Une erreur s\'est produite, veuillez réessayer.');
        this.hideModal();
      })
    ;
  }

}
