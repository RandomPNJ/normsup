import {Component, Input, AfterViewInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-ui-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss']
})
export class SignaturePadComponent implements AfterViewInit {

  // default format output is img png

  hasSigned = false;

  @Input() signatureOptions = {
    'dotSize': 0.1,
    'minWidth': 5,
    'canvasWidth': 316,
    'canvasHeight': 110
  };

  @Output() validateSignatureEvent = new EventEmitter();

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 5);
    this.signaturePad.clear();
  }

  drawComplete() {
    this.hasSigned = true;
  }

  clearSignature() {
    this.signaturePad.clear();
    this.validateSignatureEvent.emit(undefined);
    this.hasSigned = false;
  }

  validateSignature() {
    const signatureValue = this.signaturePad.toDataURL();
    this.validateSignatureEvent.emit(signatureValue);
  }
}
