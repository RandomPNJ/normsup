import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

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

  private initDocument() {
    // Call api by document type
    // If error, redirection
    this.currentDocument = {
      name: 'Extrait de KBIS',
      type: this.documentType
    };
  }
}
