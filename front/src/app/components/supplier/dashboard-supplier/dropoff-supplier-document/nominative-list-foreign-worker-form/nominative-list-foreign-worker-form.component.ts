import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-nominative-list-foreign-worker-form',
  templateUrl: './nominative-list-foreign-worker-form.component.html',
  styleUrls: ['./nominative-list-foreign-worker-form.component.scss']
})
export class NominativeListForeignWorkerFormComponent {

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
    this.workerForm.get('nominativeList').setValue(checked);
  }

  onNoNominativeListCheckboxChangeEvent(event) {
    const checked = event.target.checked;
    this.workerForm.get('noNominativeList').setValue(checked);
  }

  onFileChangeEvent(file) {
    this.workerForm.get('file').setValue(file);
  }

  onSubmit() {
    this.dropOffBtnEvent.emit(this.workerForm);
  }

}
