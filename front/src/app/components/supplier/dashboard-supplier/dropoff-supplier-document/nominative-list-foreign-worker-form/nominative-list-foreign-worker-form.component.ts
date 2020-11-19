import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CheckboxFormComponent} from '../../../../ui-components/checkbox-form/checkbox-form.component';

@Component({
  selector: 'app-nominative-list-foreign-worker-form',
  templateUrl: './nominative-list-foreign-worker-form.component.html',
  styleUrls: ['./nominative-list-foreign-worker-form.component.scss']
})
export class NominativeListForeignWorkerFormComponent {

  signatureValue = undefined;

  @ViewChild('nominativeListCheckboxFormComponent') nominativeListCheckboxFormComponent: CheckboxFormComponent;
  @ViewChild('noNominativeListCheckboxFormComponent') noNominativeListCheckboxFormComponent: CheckboxFormComponent;

  @Output() dropOffBtnEvent = new EventEmitter();

  workerForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.workerForm = this.fb.group({
      nominativeList: [false, [Validators.required]],
      noNominativeList: [false, [Validators.required]],
      file: [null, [Validators.required]]
    });
  }

  onNominativeListCheckboxChangeEvent(event) {
    const checked = event.target.checked;
    if (checked) {
      this.noNominativeListCheckboxFormComponent.setCheckboxValue(false);
      this.workerForm.get('noNominativeList').setValue(false);
    }
    this.workerForm.get('nominativeList').setValue(checked);
  }

  onNoNominativeListCheckboxChangeEvent(event) {
    const checked = event.target.checked;
    if (checked) {
      this.nominativeListCheckboxFormComponent.setCheckboxValue(false);
      this.workerForm.get('nominativeList').setValue(false);
    }
    this.workerForm.get('noNominativeList').setValue(checked);
  }

  onFileChangeEvent(file) {
    this.workerForm.get('file').setValue(file);
  }

  onSubmit() {
    this.dropOffBtnEvent.emit(this.workerForm);
  }

  isFormValid() {
    const nominativeListChecked = this.workerForm.get('nominativeList').value;
    const noNominativeListChecked = this.workerForm.get('noNominativeList').value;
    const checkboxValid = (nominativeListChecked && !noNominativeListChecked)
      || (!nominativeListChecked && noNominativeListChecked);
    return this.workerForm.valid && checkboxValid;
  }

  onValidateSignature(signature) {
    this.signatureValue = signature;
    console.log(this.signatureValue);
  }

}
