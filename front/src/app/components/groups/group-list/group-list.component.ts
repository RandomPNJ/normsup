import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { HttpService } from 'src/app/services/http.service';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { GroupsService } from 'src/app/services/groups.service';


@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  @Output() groupData: EventEmitter<String> = new EventEmitter<String>();
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
    },
    'members': {
      'other': '#'
    }
  };
  itemPluralMapping = {
    'group': {
      '=0': 'n\'avez aucun groupe',
      '=1': 'un groupe',
      'other': 'groupes'
    },
    'members': {
      '=0': 'Fournisseur',
      '=1': 'Fournisseur',
      'other': 'Fournisseurs'
    }
  };
  constructor(private modalService: BsModalService, private changeDetection: ChangeDetectorRef,
    private httpService: HttpService, private router: Router, private groupsService: GroupsService) {
      this.groupsService.groups$.subscribe(n => {
          this.items = n;

      });
    }

  ngOnInit() {
    if(this.items.length === 0) {
      this.httpService
        .get('/api/suppliers/groups')
        .subscribe(res => {
          console.log('group list res', res);
          this.items = res.body['items'];
          this.showCount = true;
          this.groupsService.addGroups(res.body['items']);
        })
      ;
    }
  }


  sendGroupData() {
    if(this.items && this.items.length > 0) {
      this.groupData.emit(JSON.stringify(this.items));
    }
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
    if(action === 'hide') {
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

  selectItem(item) {
    this.selectedItem = item.name;
  }

  openGroupParams(i) {
    this.router.navigate(['dashboard', 'groups', 'details', i]);
  }

  reloadList() {
    this.httpService
      .get('/api/suppliers/groups')
      .subscribe(res => {
        this.items = res.body['items'];
        this.showCount = true;
        this.groupsService.addGroups(res.body['items']);
      })
    ;
  }
}
