import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, ElementRef, Input, HostListener } from '@angular/core';
import { AddSupplierModalComponent } from './add-supplier-modal/add-supplier-modal.component';
import { filter as lodashFilter } from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { SupplierTableComponent } from '../supplier-table/supplier-table.component';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http.service';

declare var require: any;

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  @ViewChild('supplierTableComp') child: SupplierTableComponent;
  @ViewChild('template') public addSuppRef: TemplateRef<any>;
  @ViewChild('compDoc') public compModalRef: TemplateRef<any>;
  @ViewChild('legalDoc') public legalModalRef: TemplateRef<any>;

  showCount: Boolean = false;
  subscriptions: Subscription[] = [];
  searchCompanyID: string;
  searchCompany404: Boolean = false;
  modalRef: BsModalRef;
  subModalRef: BsModalRef;
  supplierNmb = 7;
  groupSelect: String;
  selectedCompany: any = null;
  isLoading: Boolean = false;
  filteredList: Array<any>;
  
  // Modal Info
  supplierInfo: any;
  legalDocInfo: any;
  compDocInfo: any;
  focus: any = {
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
    six: false,
    seven: false,
  };
  interlocFocus: any = {
    one: false,
    two: false,
    three: false,
    four: false,
  };

  // Add supplier modal
  modalState: String = 'enterSiret';
  company: any = {};
  companyToAdd: any = {};
  interloc: any = {
    name: '',
    lastname: '',
    phonenumber: '',
    email: ''
  };
  documentsSettings: any = {
    legal: {
      urssaf: true,
      lnte: true,
      kbis: true,
    }
  };
  itemPluralCount = {
    'suppliers': {
      '=0': '',
      '=1': '',
      'other': '#'
    }
  };
  itemPluralMapping = {
    'suppliers': {
      '=0': 'fournisseur',
      '=1': 'fournisseur',
      'other': 'fournisseurs'
    }
  };

  modalConfig = {
    animated: true,
    class: 'modal-dialog-centered'
  };
  valueWidth: Boolean = false;
  itemsDisplay: Array<any> = [];
  dataLength = -1;

  companies: any[] = [];

  constructor(
    private modalService: BsModalService,
    private apiService: ProductService,
    private changeDetection: ChangeDetectorRef,
    private httpService: HttpService) {
    }

  ngOnInit() {

  }

  openModal(template: TemplateRef<any>, modalType: String) {
    const _combine = combineLatest(
      this.modalService.onShow,
      this.modalService.onShown,
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHidden.subscribe(() => {
        this.modalState = 'enterSiret';
        this.searchCompanyID = '';
        this.companyToAdd = {};
        this.searchCompany404 = false;
        this.interloc = {name: '', lastname: '', phone: '', mail: ''};
        this.supplierInfo = {};
        this.unsubscribe();
      })
    );
    
    const config = cloneDeep(this.modalConfig);
    this.subscriptions.push(_combine);
    if(modalType !== 'Supplier' && modalType !== 'AddDoc') {
      config.class += ' modal-lg';
    }
    if(modalType == 'Supplier' && this.modalState === 'enterSiret') {
      config.class += ' modal-medium';
    } else if (modalType == 'Supplier' && (this.modalState === 'compInfo' || this.modalState === 'interlocInfo')) {
      config.class += ' modal-lg';
    } else if (modalType == 'Supplier' && this.modalState === 'docInfo'){
      config.class += ' modal-medium';
    }
    if(modalType === 'AddDoc') {
      this.subModalRef = this.modalService.show(template, config);
    } else {
      this.modalRef = this.modalService.show(template, config);
    }
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  hideModal(type) {
    console.log('type ===', type);
    if (!this.modalRef) {
      return;
    }
    if(type == 'subModal') {
      this.subModalRef.hide();
    } else {
      this.modalService.hide(1);
      this.modalState = 'enterSiret';
      this.searchCompanyID = '';
      this.valueWidth = false;
      this.companyToAdd = {};
      this.searchCompany404 = false;
      this.interloc = {name: '', lastname: '', phone: '', mail: ''};
      this.supplierInfo = {};
      this.modalRef = null;
    }
  }

  searchCompany(id: any) {
    const params = '&rows=1&q=' + id;
    this.apiService.getCompany(params)
    .subscribe(res => {
      if(res && res.records && res.records instanceof Array && res.records[0] && res.records[0].siren !== '') {
        this.fillCompany(res.records[0].fields);
        this.modalRef.setClass('modal-dialog-centered modal-lg');
        this.modalState = 'compInfo';
        this.searchCompany404 = false;
      } else {
        this.searchCompany404 = true;
      }
    }, err => {
      console.log('Error, ', err);
      this.searchCompany404 = true;
    });
  }

  fillCompany(record: any) {
    this.companyToAdd.denomination = record.denominationunitelegale;
    this.companyToAdd.legalUnit = record.classeunitelegale;
    this.companyToAdd.postalCode = record.codepostaletablissement;
    this.companyToAdd.siren = record.siren;
    this.companyToAdd.address = record.adresseetablissement;
    this.companyToAdd.dateCreation = moment(record.datecreationetablissement, 'YYYY/MM/DD').format('DD/MM/YYYY');
    this.companyToAdd.siret = record.siret;
    this.companyToAdd.city = record.libellecommuneetablissement;
    // this.companyToAdd.client = 'Fakeclient';
  }

  openInfoModal(event) {
    if(event) {
      switch(event.type) {
        case 'Supplier':
            // this.supplierInfo = event.data;
            this.openModal(this.addSuppRef, 'Supplier');
            break;
        case 'Legaldoc':
            this.legalDocInfo = event.data;
            this.openModal(this.legalModalRef, 'Legaldoc');
            break;
        case 'Compdoc':
            this.compDocInfo = event.data;
            this.openModal(this.compModalRef, 'Compdoc');
            break;
        case 'AddDoc':
            this.openModal(event.data, 'AddDoc');
            break;
      }
    } else {
      return;
    }
  }

  onCompanySelection(company: any) {
    if(company !== null) {
      this.selectedCompany = company;
    }
  }

  addCompany(data: any) {
    console.log('Company', data);
    data.comp.denomination = data.comp.denomination.charAt(0).toUpperCase() + data.comp.denomination.toLowerCase().slice(1);
    this.apiService.postData('/api/supplier/define_supplier', data)
    .subscribe(res => {
      this.hideModal('');
      console.log('Res ', res);
    }, err => {
      console.log('Error, ', err);
    });
  }

  suppliersDataUpdate(e) {
    if(e) {
      this.dataLength = e;
    }
  }

  previous(state: String) {
    if(state === 'enterSiret') {
      this.modalState = state;
      this.companyToAdd = {};
      this.modalRef.setClass('modal-dialog-centered modal-sm');
    } else if(state === 'compInfo') {
      this.modalState = state;
      this.interloc = {};
    } else if(state === 'interlocInfo') {
      this.modalState = state;
      this.modalRef.setClass('modal-dialog-centered modal-lg');
    }
  }
  setModalClass() {
    this.valueWidth = !this.valueWidth;
    const modalWidth = this.valueWidth ? 'modal-lg' : 'modal-sm';
    this.modalRef.setClass('modal-dialog-centered ' + modalWidth);
    this.modalState = 'compInfo';
  }

  interlocInfo() {
    this.modalState = 'interlocInfo';
  }

  docInfo() {
    this.modalRef.setClass('modal-dialog-centered modal-medium');
    this.modalState = 'docInfo';
  }

}
