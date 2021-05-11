import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CheckboxFormComponent} from '../../../../ui-components/checkbox-form/checkbox-form.component';
import {SignaturePadComponent} from '../../../../ui-components/signature-pad/signature-pad.component';
import {UploadDocumentBtnComponent} from '../../../../ui-components/upload-document-btn/upload-document-btn.component';
import HelloSign from "hellosign-embedded";
import * as moment from 'moment';

@Component({
  selector: 'app-nominative-list-foreign-worker-form',
  templateUrl: './nominative-list-foreign-worker-form.component.html',
  styleUrls: ['./nominative-list-foreign-worker-form.component.scss']
})
export class NominativeListForeignWorkerFormComponent implements OnInit {

  signatureValue = undefined;

  @ViewChild('nominativeListCheckboxFormComponent') nominativeListCheckboxFormComponent: CheckboxFormComponent;
  @ViewChild('noNominativeListCheckboxFormComponent') noNominativeListCheckboxFormComponent: CheckboxFormComponent;

  @ViewChild('signaturePadComponent') signaturePadComponent: SignaturePadComponent;
  @ViewChild('uploadDocumentBtnComponent') uploadDocumentBtnComponent: UploadDocumentBtnComponent;

  @Output() dropOffBtnEvent = new EventEmitter();

  workerForm: FormGroup;

  // HelloSign
  helloSignClient: any;
  signUrl: String = '';

  currentUser;
  currentUserCompany;

  displayNominativeListTemplate = false;
  displayNoNominativeListTemplate = false;

  formValid = false;

   now = moment();

  constructor(
    private fb: FormBuilder
  ) {
    this.workerForm = this.fb.group({
      nominativeList: [false, [Validators.required]],
      noNominativeList: [false, [Validators.required]],
      file: [null, [Validators.required]]
    });
    // this.helloSignClient = new HelloSign(this.signUrl, {
    //   clientId: '4413cfbd33daa2c75a85ff35ab180f84a5b361de1491f5a0603395fab5c3c5f3',
    //   redirectTo: 'http://app.normsup.com/supplier/signsuccess',
    //   allowCancel: true,
    //   debug: true
    // });
  }

  ngOnInit() {
    // Call HTTP for getting current user/company
    this.currentUser = {
      firstname: 'Yassin',
      lastname: 'El Fahim'
    };

    this.currentUserCompany = {
      denomination: 'AXA Banque et Assurance',
      siret: '1234567890',
      address: '1 Rue du Temple, Paris, 75001, France'
    };
  }

  onNominativeListCheckboxChangeEvent(event) {
    const checked = event.target.checked;
    if(checked) {
      this.handleNominativeCheckEvent();
    } else {
      this.handleNominativeUncheckEvent();
    }
    this.workerForm.get('nominativeList').setValue(checked);
    this.computeFormValid();
  }

  onNoNominativeListCheckboxChangeEvent(event) {
    const checked = event.target.checked;
    if(checked) {
      this.handleNoNominativeCheckEvent();
    } else {
      this.handleNoNominativeUncheckEvent();
    }
    this.workerForm.get('noNominativeList').setValue(checked);
    this.computeFormValid();
  }

  onFileChangeEvent(file) {
    this.workerForm.get('file').setValue(file);
    this.computeFormValid();
  }

  onSubmit() {
    this.dropOffBtnEvent.emit(this.workerForm);
  }

  onValidateSignature(signature) {
    this.signatureValue = signature;
  }

  private handleNominativeUncheckEvent() {
    this.workerForm.get('nominativeList').setValue(false);
    this.workerForm.get('file').setValue(null);
    this.nominativeListCheckboxFormComponent.setCheckboxValue(false);
    this.displayNominativeListTemplate = false;
  }

  private handleNoNominativeUncheckEvent() {
    this.workerForm.get('noNominativeList').setValue(false);
    this.noNominativeListCheckboxFormComponent.setCheckboxValue(false);
    this.displayNoNominativeListTemplate = false;
  }

  private handleNominativeCheckEvent() {
    this.noNominativeListCheckboxFormComponent.setCheckboxValue(false);
    this.workerForm.get('noNominativeList').setValue(false);
    this.displayNominativeListTemplate = true;
    this.displayNoNominativeListTemplate = false;
    if (this.signaturePadComponent) {
      this.signaturePadComponent.clearSignature();
    }
  }

  private handleNoNominativeCheckEvent() {
    this.nominativeListCheckboxFormComponent.setCheckboxValue(false);
    this.workerForm.get('nominativeList').setValue(false);
    this.displayNominativeListTemplate = false;
    this.displayNoNominativeListTemplate = true;
    this.workerForm.get('file').setValue(null);
    if (this.uploadDocumentBtnComponent) {
      this.uploadDocumentBtnComponent.deleteFile();
    }
  }

  private computeFormValid() {
    const nominativeListChecked = this.workerForm.get('nominativeList').value;
    const noNominativeListChecked = this.workerForm.get('noNominativeList').value;
    const checkboxValid = (nominativeListChecked && !noNominativeListChecked)
      || (!nominativeListChecked && noNominativeListChecked);
    this.formValid = this.workerForm.valid && checkboxValid;

    console.log('nominativeListChecked ' + nominativeListChecked);
    console.log('noNominativeListChecked ' + noNominativeListChecked);
    console.log('this.workerForm.valid ' + this.workerForm.valid);
    console.log(this.workerForm);
    console.log('formValid ' + this.formValid);
  }

}
