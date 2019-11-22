import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { HttpService } from 'src/app/services/http.service';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  @ViewChild('addCompGroup') public addGroupModal: TemplateRef<any>;
  subscriptions: Subscription[] = [];
  modalRef: BsModalRef;
  modalConfig = {
    animated: true,
    class: 'modal-dialog-centered modal-sm'
  };
  modalState: String = 'groupName';
  showCount: Boolean = false;
  selectedItem: string;
  items = [];
  group: {
    name: '',
    
  }
  itemPluralCount = {
    'group': {
      '=0': '',
      '=1': '',
      'other': '#'
    }
  };
  itemPluralMapping = {
    'group': {
      '=0': 'n\'avez aucun groupe',
      '=1': 'un groupe',
      'other': 'groupes'
    }
  };
  constructor(private modalService: BsModalService, private changeDetection: ChangeDetectorRef,
    private httpService: HttpService) { }

  ngOnInit() {
    this.httpService
      .get('/api/supplier/groups')
      .subscribe(res => {
        console.log('Groups res', res);
        this.items = res.body['items'];
        this.showCount = true;
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
    this.modalRef = this.modalService.show(this.addGroupModal, config);
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

  changeModal(action) {
    console.log('changeModal', action);
    if(action === 'hide') {
      this.hideModal();
    }
    if(action === 'groupMembers') {
      console.log('changeModal2', action);
      this.modalRef.setClass('modal-dialog-centered modal-extra');
    }
    if(action === 'groupName') {
      this.modalRef.setClass('modal-dialog-centered modal-sm');
    }
    if(action === 'docInfo') {
      console.log('changeModal docInfo', action);
      this.modalRef.setClass('modal-dialog-centered modal-medium');
    }
  }

  selectItem(item) {
    this.selectedItem = item.name;
  }
}
