import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-vigilance-certificate-form',
  templateUrl: './vigilance-certificate-form.component.html',
  styleUrls: ['./vigilance-certificate-form.component.scss']
})
export class VigilanceCertificateFormComponent {

  @Output() dropOffBtnEvent = new EventEmitter();

  vigilanceCertificateForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.vigilanceCertificateForm = this.fb.group({
      urssaf: [false, [Validators.required]],
      otherOrganization: [false, [Validators.required]],
      file: [null, [Validators.required]]
    });
  }

  onSubmit() {
    this.dropOffBtnEvent.emit(this.vigilanceCertificateForm);
  }

  onUrssafCheckboxChangeEvent(event) {
    const checked = event.target.checked;
    this.vigilanceCertificateForm.get('urssaf').setValue(checked);
  }

  onOtherOrganizationCheckboxChangeEvent(event) {
    const checked = event.target.checked;
    this.vigilanceCertificateForm.get('otherOrganization').setValue(checked);
  }

  onFileChangeEvent(file) {
    this.vigilanceCertificateForm.get('file').setValue(file);
  }

}
