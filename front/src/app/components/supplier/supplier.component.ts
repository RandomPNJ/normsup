import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, ElementRef, Input } from '@angular/core';
import { AddSupplierModalComponent } from './add-supplier-modal/add-supplier-modal.component';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  @ViewChild('supplierinfo') public infoModalRef: TemplateRef<any>;
  @ViewChild('compDoc') public compModalRef: TemplateRef<any>;
  @ViewChild('legalDoc') public legalModalRef: TemplateRef<any>;
  subscriptions: Subscription[] = [];
  searchCompanyID: string;
  modalRef: BsModalRef;
  supplierNmb = 7;
  groupSelect: String;
  selectedCompany: any = null;
  isLoading: Boolean = false;
  filteredList: Array<any>;
  company: any = {};
  companyToAdd: any = {};
  supplierInfo: any;
  legalDocInfo: any;
  compDocInfo: any;
  modalState: String = 'enterSiret';
  addInterloc: Boolean = false;
  interloc: any = {
    name: '',
    lastname: '',
    phone: '',
    mail: ''
  };

  itemPluralMapping = {
    'supplier': {
      '=0': 'n\'avez aucun fournisseur',
      '=1': 'un fournisseur',
      'other': '# fournisseurs'
    }
  };

  modalConfig = {
    animated: true,
  };
  itemsDisplay: Array<any> = [];
  // items = fakeData.items;
  items = [];

  companies: any[] = [];

  constructor(
    private modalService: BsModalService,
    private apiService: ProductService,
    private changeDetection: ChangeDetectorRef,
    private httpService: HttpService) {
    }

  ngOnInit() {
    // this.httpService.get('http://localhost:8091/api/supplier')
    //   .subscribe(res => {

    //     this.itemsDisplay = res.body['items'];
    //     this.child.reload();
    //   })
    // ;
    // this.itemsDisplay = [...this.items];
    // this.modalState = 'compInfo';
    // this.companyToAdd.denom = this.company.fields.denominationunitelegale;
    // this.companyToAdd.siren = this.company.fields.siren;
    // this.companyToAdd.adress = this.company.fields.adresseetablissement;
    // this.companyToAdd.dateCrea = moment(this.company.fields.datecreationetablissement, "YYYY/MM/DD").format('DD/MM/YYYY');
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
        this.company = {};
        this.searchCompanyID = '';
        this.companyToAdd = {};
        this.addInterloc = false;
        this.interloc = {name: '', lastname: '', phone: '', mail: ''};
        this.supplierInfo = {};
        this.unsubscribe();
      })
    );

    const config = cloneDeep(this.modalConfig);
    this.subscriptions.push(_combine);
    if(modalType !== 'Supplier') {
      config.class = 'modal-lg';
    }
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
    this.modalState = 'enterSiret';
    this.company = {};
    this.searchCompanyID = '';
    this.companyToAdd = {};
    this.addInterloc = false;
    this.interloc = {name: '', lastname: '', phone: '', mail: ''};
    this.supplierInfo = {};
    this.modalRef = null;
  }

  searchCompany(id: any) {
    const params = '&rows=1&q=' + id;
    this.apiService.getCompany(params)
    .subscribe(res => {
      this.modalState = 'compInfo';
      console.log('Res ', res);
      if(res && res.records && res.records instanceof Array && res.records[0]) {
        this.company = res.records[0];
        this.fillCompany(res.records[0].fields);
        // console.log('this.company', this.company.fields);
      }
    }, err => {
      console.log('Error, ', err);
    });
  }

  fillCompany(record: any) {
    this.companyToAdd.denomination = record.denominationunitelegale;
    this.companyToAdd.siren = record.siren;
    this.companyToAdd.address = record.adresseetablissement;
    this.companyToAdd.dateCreation = moment(record.datecreationetablissement, 'YYYY/MM/DD').format('DD/MM/YYYY');
    this.companyToAdd.siret = record.siret;
    this.companyToAdd.client = 'Fakeclient';
  }

  openInfoModal(event) {
    if(event) {
      switch(event.type) {
        case 'Supplier':
            console.log(event.data);
            this.supplierInfo = event.data;
            this.openModal(this.infoModalRef, 'Supplier');
            break;
        case 'Legaldoc':
            this.legalDocInfo = event.data;
            this.openModal(this.legalModalRef, 'Legaldoc');
            break;
        case 'Compdoc':
            this.compDocInfo = event.data;
            this.openModal(this.compModalRef, 'Compdoc');
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
    this.apiService.postData('/api/supplier/define_supplier', data.comp)
    .subscribe(res => {
      this.hideModal();
      console.log('Res ', res);
    }, err => {
      console.log('Error, ', err);
    });
    // this.itemsDisplay.push(data.comp);
    // this.child.reload(data.comp);
  }
}
