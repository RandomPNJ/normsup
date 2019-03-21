import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  isLoding = false;
  @Input() title;
  @Input() message;
  @Input() type;
  @Input() data;
  @Input() isData;
  @Input() isSessionExpired;
  // @Input() isopen;
  @Output() modalClose = new EventEmitter();
  @Output() reload = new EventEmitter();
  @Output() backToLogin = new EventEmitter();
  @Output() changeStatus: any =  new EventEmitter();
  @ViewChild('template') template: ElementRef;
  @ViewChild('logintemplate') logintemplate: ElementRef;
  @ViewChild('noresulttemp') noresulttemp: ElementRef;
  @ViewChild('datetemplate') datetemplate: ElementRef;
  @ViewChild('statustemp') statustemp: ElementRef;
  @ViewChild('sessionTemplate') sessionTemplate: ElementRef;
  @ViewChild('successTemplate') successTemplate: ElementRef;
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {

  }

  ngOnInit() {

  }


  openSucess() {
    this.message = 'Success';
    this.modalRef = this.modalService.show(this.successTemplate);
  }
  openfailed(error) {
    this.message = error;
    this.modalRef = this.modalService.show(this.successTemplate);
  }
  openStatusModal() {
    this.modalRef = this.modalService.show(this.statustemp);
  }

  openSessionModal() {
    this.modalRef = this.modalService.show(this.sessionTemplate);
  }
  openModal(title, message, type) {
    this.title = title;
    this.message = message;
    this.type = type;
    this.modalRef = this.modalService.show(this.template);
  }

  openResultModal() {
    this.modalRef = this.modalService.show(this.noresulttemp);
  }

  openLogin(title, message, type) {
    this.title = title;
    this.message = message;
    this.type = type;
    this.modalRef = this.modalService.show(this.logintemplate);
  }
  change() {
    this.isLoding = true;
    this.changeStatus.emit();
  }
  refresh() {
    this.modalRef.hide();
    this.reload.emit();
  }

  goToLogin() {
    this.modalRef.hide();
    this.backToLogin.emit();
  }
  close() {
    this.modalRef.hide();
    this.modalClose.emit();
  }

  closeWait() {
    this.modalRef.hide();
  }
}
