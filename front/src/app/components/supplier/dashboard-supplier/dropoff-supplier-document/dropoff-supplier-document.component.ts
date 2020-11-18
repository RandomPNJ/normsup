import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dropoff-supplier-document',
  templateUrl: './dropoff-supplier-document.component.html',
  styleUrls: ['./dropoff-supplier-document.component.scss']
})
export class DropoffSupplierDocumentComponent implements OnInit {

  documentType;

  currentDocument;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      this.documentType = data.documentType;
      this.initDocument();
    });
  }

  onKbisSaveEvent(form) {
    console.log('In onKbisSaveEvent method');
    console.log(form.get('file').value);
  }

  onVigilanceCertificateSaveEvent(form) {
    const urssaf = form.get('urssaf').value;
    const otherOrganization = form.get('otherOrganization').value;
    const file = form.get('file').value;

    console.log('In onVigilanceCertificateSaveEvent method');
    console.log({
      urssaf: urssaf,
      otherOrganization: otherOrganization,
      file: file
    });
  }

  private initDocument() {
    // Call api by document type
    // If error, redirection
    if ('KBIS' === this.documentType) {
      this.currentDocument = {
        name: 'Extrait de KBIS',
        type: this.documentType
      };
    }

    switch (this.documentType) {
      case 'KBIS':
        this.currentDocument = {
          name: 'Extrait de KBIS',
          type: this.documentType
        };
        break;
      case 'ATTESTATION_VIGILANCE':
        this.currentDocument = {
          name: 'Attestation de vigilance',
          type: this.documentType
        };
        break;
      default:
        this.currentDocument = {
          name: 'Extrait de KBIS',
          type: this.documentType
        };
        break;
    }
  }
}
