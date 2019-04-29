import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, ElementRef, Input } from '@angular/core';
import { AddSupplierModalComponent } from './add-supplier-modal/add-supplier-modal.component';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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

  // @ViewChild(AddSupplierModalComponent) appAddSupplierModal: AddSupplierModalComponent;
  @ViewChild('companyInput') companyInputRef: ElementRef;

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
        this.companies.length = 0;
        this.searchCompanyID = '';
        this.unsubscribe();
      })
    );

    this.subscriptions.push(_combine);
    this.modalRef = this.modalService.show(template, this.modalConfig);
    this.companyInputRef.nativeElement.focus();
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  searchCompany(id: any) {
    const params = '&q=' + id;
    this.apiService.getCompany(params)
    .subscribe(res => {
      console.log('Res ', res);
      if(res && res.records) {
        this.companies = res.records;
      }
    }, err => {
      console.log('Error, ', err);
    });
  }
}
