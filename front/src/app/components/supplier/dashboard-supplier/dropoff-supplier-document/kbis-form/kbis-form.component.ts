import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-kbis-form',
  templateUrl: './kbis-form.component.html',
  styleUrls: ['./kbis-form.component.scss']
})
export class KbisFormComponent {

  @Output() dropOffBtnEvent = new EventEmitter();

  kbisForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.kbisForm = this.fb.group({
      file: [null, [Validators.required]]
    });
  }

  onFileChangeEvent(file) {
    this.kbisForm.get('file').setValue(file);
  }

  onSubmit() {
    console.log(this.kbisForm);
    this.dropOffBtnEvent.emit(this.kbisForm);
  }
}
