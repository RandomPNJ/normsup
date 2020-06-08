import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { remove, compact, cloneDeep } from 'lodash';
import { HttpService } from 'src/app/services/http.service';
import { UploadService } from 'src/app/services/upload.service';
import { Subscription, combineLatest } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotifService } from 'src/app/services/notif.service';

@Component({
  selector: 'app-supplier-upload-interface',
  templateUrl: './supplier-upload-interface.component.html',
  styleUrls: ['./supplier-upload-interface.component.scss']
})
export class SupplierUploadInterfaceComponent implements OnInit {

  @ViewChild('uploadConfirmation') public uploadConfirmationModal: TemplateRef<any>;

  // Modal variables
  subscriptions: Subscription[] = [];
  modalRef: BsModalRef;
  subModalRef: BsModalRef;
  modalConfig = {
    animated: true,
    class: 'modal-dialog-centered modal-medium'
  };

  documentStatus: any = {
    urssaf: false,
    lnte: false,
    kbis: false
  };
  
  compDocs: any[] = [
  ]
  type: string = 'LEGAL';

  urssafDocument: any;
  lnteDocument: any;
  kbisDocument: any;
  compDocument: any;


  deleteFileType: String;

  constructor(
    private router: Router, 
    private httpService: HttpService,
    private notifService: NotifService,
    private uploadService: UploadService,
    private changeDetection: ChangeDetectorRef,
    private modalService: BsModalService) { 
  }

  ngOnInit() {

  }

  switchType(type) {
    if(type === 'LEGAL' || type === 'COMP') {
      this.type = type;
    }
  }

  inputFilechange(e, type) {
    let file;
    if(e.target && e.target.files && e.target.files['0']) {
      file = e.target.files['0'];
      if(file.size > 20000000) {
        return this.notifService.error('Le fichier selectionné fais plus de 20mo.');
      }
      if(file.type !== 'application/pdf') {
        return this.notifService.error('Le fichier selectionné n\'est pas en format pdf.');
      } else {
        switch(type) {
          case 'Comp':
            this.compDocs.push(file);
            this.compDocument = '';
            // console.log('compDocs', this.compDocs);
            break;
          case 'Kbis':
            this.kbisDocument = file;
            this.documentStatus.kbis = true;
            break;
          case 'Lnte':
            this.lnteDocument = file;
            this.documentStatus.lnte = true;
            break;
          case 'Urssaf':
            this.urssafDocument = file;
            this.documentStatus.urssaf = true;
            break;
        }
      }
    }
  }

  sendDocuments(type) {
    let main_form: FormData = new FormData();

    if(type === 'LEGAL') {
      if(this.kbisDocument) {
        main_form.append('files', this.kbisDocument, 'k' + this.kbisDocument.name);
      }
      if(this.lnteDocument) {
        main_form.append('files',this.lnteDocument,  'l' + this.lnteDocument.name);
      }
      if(this.urssafDocument) {
        main_form.append('files', this.urssafDocument, 'u' + this.urssafDocument.name);
      }
      
      return this.httpService
        .uploadDocument('/api/documents/upload', main_form)
        .subscribe(res => {
          return this.openModal(this.uploadConfirmationModal);
        })
      ;
    } else if(type === 'COMP') {

      this.compDocs.map(compDoc => {
        main_form.append('files', compDoc, 'c' + compDoc.name);
      });

      return this.httpService
        .uploadDocument('/api/documents/upload', main_form)
        .subscribe(res => {
          return this.openModal(this.uploadConfirmationModal);
        }, err => {
          return;
        })
      ;
    } else {
      return;
    }
    // this.router.navigate(['upload', 'success']);
  }

  openModal(template: TemplateRef<any>) {
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
    this.modalRef = this.modalService.show(template, config);
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

  deleteCompDoc(item) {
    remove(this.compDocs, (n) => {
      return n.name === item.name;
    });
  }


  deleteFile(type) {
    switch(type) {
      // case 'Comp':
      //   this.compDocs.push(e.target.files['0']);
      //   this.compDocument = '';
      //   console.log('compDocs', this.compDocs);
      //   break;
      case 'KBIS':
        this.kbisDocument = '';
        this.documentStatus.kbis = false;
        break;
      case 'LNTE':
        this.lnteDocument = '';
        this.documentStatus.lnte = false;
        break;
      case 'URSSAF':
        this.urssafDocument = '';
        this.documentStatus.urssaf = false;
        break;
    }
  }

  navigateSuccessPage() {
    this.router.navigate(['supplier', 'upload', 'success']);
    this.hideModal();
  }


  continue() {
    this.kbisDocument = '';
    this.lnteDocument = '';
    this.urssafDocument = '';



    this.documentStatus.lnte = false;
    this.documentStatus.urssaf = false;
    this.documentStatus.kbis = false;
    this.hideModal();
  }
}
