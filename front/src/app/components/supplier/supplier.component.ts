import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, ElementRef, Input } from '@angular/core';
import { AddSupplierModalComponent } from './add-supplier-modal/add-supplier-modal.component';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { filter as lodashFilter } from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  subscriptions: Subscription[] = [];
  searchCompanyID: string;
  modalRef: BsModalRef;
  supplierNmb = 7;
  searchState: Boolean = true;
  selectedCompany: any = null;

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
  itemsDisplay: Array<any>;
  items = [
    {
      status: true,
      name: 'vert',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },{
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },{
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },{
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },{
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },{
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    }
  ];

  companies: any[] = [];

  constructor(
    private modalService: BsModalService,
    private apiService: ProductService,
    private changeDetection: ChangeDetectorRef) { }

  ngOnInit() {
    this.itemsDisplay = this.items;
  }

  openModal(template: TemplateRef<any>) {
    const _combine = combineLatest(
      // this.modalService.onShow,
      // this.modalService.onShown,
      // this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHidden.subscribe(() => {
        this.searchState = true;
        this.companies.length = 0;
        this.searchCompanyID = '';
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

  filterByGroup(value: any) {
    lodashFilter(items, (value) => {

    });
  }

  searchCompany(id: any) {
    const params = '&q=' + id;
    this.apiService.getCompany(params)
    .subscribe(res => {
      this.searchState = false;
      console.log('Res ', res);
      if(res && res.records) {
        this.companies = res.records;
      }
    }, err => {
      console.log('Error, ', err);
    });
  }

  onCompanySelection(company: any) {
    if(company !== null) {
      this.selectedCompany = company;
    }
  }

  addCompany(company: any) {
    
  }
}
