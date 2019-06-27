import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, ElementRef, Input } from '@angular/core';
import { AddSupplierModalComponent } from './add-supplier-modal/add-supplier-modal.component';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { filter as lodashFilter } from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { SupplierTableComponent } from '../supplier-table/supplier-table.component';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http.service';

declare var require: any;
const fakeData = require('./fakeData.json');

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  @ViewChild('supplierTableComp') child: SupplierTableComponent;
  @ViewChild('supplierinfo') public infoModalRef: TemplateRef<any>;
  subscriptions: Subscription[] = [];
  searchCompanyID: string;
  modalRef: BsModalRef;
  supplierNmb = 7;
  groupSelect: String;
  selectedCompany: any = null;
  isLoading: Boolean = false;
  filteredList: Array<any>;
  // company: any = {"datasetid": "sirene_v3@public", "recordid": "baa8f969f38538021650304a70329a7fbfaa9585", "fields": {"siretsiegeunitelegale": "38793642000034", "soussectionetablissement": "Travaux de construction specialises", "trancheeffectifsunitelegale": "NN", "activiteprincipaleunitelegale": "43.34Z", "sexeunitelegale": "Masculin", "adresseetablissement": "GRAND CUL DE SAC", "groupeunitelegale": "Travaux de peinture et vitrerie", "classeetablissement": "Travaux de peinture et vitrerie", "prenomusuelunitelegale": "RAYMOND", "prenom1unitelegale": "RAYMOND", "activiteprincipaleetablissement": "43.34Z", "datederniertraitementetablissement": "2019-05-22T21:05:51+00:00", "siren": "387936420", "naturejuridiqueunitelegale": "Entrepreneur individuel", "nomenclatureactiviteprincipaleunitelegale": "NAFRev2", "nomunitelegale": "MEPHARA", "nomenclatureactiviteprincipaleetablissement": "NAFRev2", "divisionunitelegale": "Travaux de finition", "nombreperiodesetablissement": 1, "sectionunitelegale": "Construction", "nic": "00034", "siret": "38793642000034", "prenom2unitelegale": "CELESTIN", "nicsiegeunitelegale": "00034", "libellevoieetablissement": "GRAND CUL DE SAC", "etatadministratifetablissement": "Actif", "groupeetablissement": "Travaux de peinture et vitrerie", "datecreationunitelegale": "1992-04-27", "sectionetablissement": "Construction", "etatadministratifunitelegale": "Active", "categorieentreprise": "PME", "categoriejuridiqueunitelegale": "1000", "etablissementsiege": "oui", "codecommuneetablissement": "97701", "divisionetablissement": "Travaux de finition", "datecreationetablissement": "2019-05-16", "caractereemployeuretablissement": "Non", "soussectionunitelegale": "Travaux de construction specialises", "libellecommuneetablissement": "SAINT BARTHELEMY", "caractereemployeurunitelegale": "Non", "anneecategorieentreprise": "2016", "statutdiffusionetablissement": "O", "codepostaletablissement": "97133", "datederniertraitementunitelegale": "2019-05-22T21:05:51+00:00", "datedebutetablissement": "2019-05-16", "classeunitelegale": "Travaux de peinture et vitrerie", "statutdiffusionunitelegale": "O"}, "record_timestamp": "2019-05-23T00:04:00+00:00"}
  company: any = {};
  companyToAdd: any = {};
  supplierInfo: any;
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
    animated: true
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

  openModal(template: TemplateRef<any>) {
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

    this.subscriptions.push(_combine);
    this.modalRef = this.modalService.show(template, this.modalConfig);
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
    this.companyToAdd.denom = record.denominationunitelegale;
    this.companyToAdd.siren = record.siren;
    this.companyToAdd.adress = record.adresseetablissement;
    this.companyToAdd.dateCrea = moment(record.datecreationetablissement, 'YYYY/MM/DD').format('DD/MM/YYYY');
  }

  openSupplierInfo(item) {
    if(item) {
      console.log(item);
      this.supplierInfo = item;
      this.openModal(this.infoModalRef);
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
    data.comp.denom = data.comp.denom.charAt(0).toUpperCase() + data.comp.denom.toLowerCase().slice(1);
    this.itemsDisplay.push(data.comp);
    this.child.reload(data.comp);
    this.hideModal();
  }
}
