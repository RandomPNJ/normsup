import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { AddSupplierModalComponent } from './add-supplier-modal/add-supplier-modal.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  @ViewChild(AddSupplierModalComponent) appAddSupplierModal: AddSupplierModalComponent;
  @ViewChild('content') private modalRef: TemplateRef<any>;
  supplierNmb = 7;

  itemPluralMapping = {
    'supplier': {
      '=0': 'n\'avez aucun fournisseur',
      '=1': 'un fournisseur',
      'other': '# fournisseurs'
    }
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
  
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  openModal(content) {
    this.modalService.open(this.modalRef, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
      console.log('Clone result = ', result);
    }, (reason) => {
      console.log('Clone reason = ', reason);
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
