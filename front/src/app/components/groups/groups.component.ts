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
    class: 'modal-dialog-centered'
  };
  selectedItem: string;
  items = [];
  itemPluralMapping = {
    'group': {
      '=0': 'n\'avez aucun groupe',
      '=1': 'un groupe',
      'other': '# groupes'
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
    this.modalRef = null;
  }

  selectItem(item) {
    this.selectedItem = item.name;
  }
}
