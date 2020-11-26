import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CheckboxFormComponent} from '../../../../ui-components/checkbox-form/checkbox-form.component';

@Component({
  selector: 'app-vigilance-certificate-form',
  templateUrl: './vigilance-certificate-form.component.html',
  styleUrls: ['./vigilance-certificate-form.component.scss']
})
export class VigilanceCertificateFormComponent {

  @ViewChild('urssafCheckboxFormComponent') urssafCheckboxFormComponent: CheckboxFormComponent;
  @ViewChild('otherOrganizationCheckboxFormComponent') otherOrganizationCheckboxFormComponent: CheckboxFormComponent;

  @Output() dropOffBtnEvent = new EventEmitter();

  vigilanceCertificateForm: FormGroup;

  disableOtherOrganizationName = true;

  constructor(
    private fb: FormBuilder
  ) {
    this.vigilanceCertificateForm = this.fb.group({
      urssaf: [false, [Validators.required]],
      otherOrganization: [false, [Validators.required]],
      otherOrganizationName: [''],
      file: [null, [Validators.required]]
    });
  }

  onSubmit() {
    this.dropOffBtnEvent.emit(this.vigilanceCertificateForm);
  }

  onUrssafCheckboxChangeEvent(event) {
    const checked = event.target.checked;

    if (checked) {
      this.vigilanceCertificateForm.get('otherOrganization').setValue(false);
      this.vigilanceCertificateForm.get('otherOrganizationName').setValue('');
      this.disableOtherOrganizationName = true;
      this.otherOrganizationCheckboxFormComponent.setCheckboxValue(false);
    }
    this.vigilanceCertificateForm.get('urssaf').setValue(checked);
  }

  onOtherOrganizationCheckboxChangeEvent(event) {
    const checked = event.target.checked;
    if (checked) {
      this.vigilanceCertificateForm.get('urssaf').setValue(false);
      this.urssafCheckboxFormComponent.setCheckboxValue(false);
      this.disableOtherOrganizationName = false;
    }
    this.vigilanceCertificateForm.get('otherOrganization').setValue(checked);
  }

  onFileChangeEvent(file) {
    this.vigilanceCertificateForm.get('file').setValue(file);
  }

  isFormValid() {
    const urssafChecked = this.vigilanceCertificateForm.get('urssaf').value;
    const otherOrganizationListChecked = this.vigilanceCertificateForm.get('otherOrganization').value;
    const otherOrganizationNameValue = this.vigilanceCertificateForm.get('otherOrganizationName').value;
    const checkboxValid = (urssafChecked && !otherOrganizationListChecked)
      || (!urssafChecked && otherOrganizationListChecked && '' !== otherOrganizationNameValue);
    return this.vigilanceCertificateForm.valid && checkboxValid;
  }

}
