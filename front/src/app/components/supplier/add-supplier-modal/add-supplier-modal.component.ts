import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-supplier-modal',
  templateUrl: './add-supplier-modal.component.html',
  styleUrls: ['./add-supplier-modal.component.scss']
})
export class AddSupplierModalComponent implements OnInit {

  closeResult: string;

  @ViewChild('content') content: ElementRef;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  openDefault() {
    this.modalService.open('content', {ariaLabelledBy: 'modal-basic-title'});
    // .result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
