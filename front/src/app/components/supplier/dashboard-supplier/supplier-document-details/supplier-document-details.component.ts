import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-supplier-document-details',
  templateUrl: './supplier-document-details.component.html',
  styleUrls: ['./supplier-document-details.component.scss']
})
export class SupplierDocumentDetailsComponent implements OnInit {

  documentType: string;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      this.documentType = data.documentType;
    });
  }

}
