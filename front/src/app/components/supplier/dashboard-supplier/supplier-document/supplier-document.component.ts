import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-supplier-document',
  templateUrl: './supplier-document.component.html',
  styleUrls: ['./supplier-document.component.scss']
})
export class SupplierDocumentComponent implements OnInit {

  constructor(
    private router: Router
  ) {}

  supplierDocuments = [
    {
      name: 'KBIS',
      customerCount: 10
    },
    {
      name: 'URSSAF',
      customerCount: 7
    },
    {
      name: 'LNTE',
      customerCount: 34
    },
    {
      name: 'URSSAF',
      customerCount: 7
    },
    {
      name: 'LNTE',
      customerCount: 34
    }
  ];

  ngOnInit(): void {}

  open(supplierDocument) {
    this.router.navigate(['/supplier/dashboard/documents/details'], { queryParams: {
        documentType: supplierDocument.name
      }});
  }

}
