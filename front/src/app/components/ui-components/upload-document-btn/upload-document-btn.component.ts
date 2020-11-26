import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-ui-upload-document-btn',
  templateUrl: './upload-document-btn.component.html',
  styleUrls: ['./upload-document-btn.component.scss']
})
export class UploadDocumentBtnComponent {

  @Input() acceptedFormatsLabel;
  @Input() acceptedFormat;

  @Output() fileChangeEvent = new EventEmitter();

  @ViewChild('fileInput') fileInput: ElementRef;

  file: File | null = null;

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    if (event && event.item(0)) {
      this.file = event.item(0);
    } else {
      this.file = null;
    }
    this.fileChangeEvent.emit(this.file);
  }

  deleteFile() {
    this.fileInput.nativeElement.value = '';
  }

}
