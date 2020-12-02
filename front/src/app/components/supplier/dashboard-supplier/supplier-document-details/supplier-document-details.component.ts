import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SupplierService} from '../../../../services/supplier.service';
import {NotifService} from '../../../../services/notif.service';

@Component({
  selector: 'app-supplier-document-details',
  templateUrl: './supplier-document-details.component.html',
  styleUrls: ['./supplier-document-details.component.scss']
})
export class SupplierDocumentDetailsComponent implements OnInit {

  documentType: string;

  clients = []; // la liste des clients
  currentDocument; // le document

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private notificationService: NotifService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      this.documentType = data.documentType;

      this.initMockClientList();
      this.initDocument();
    });
  }

  private initMockClientList() {
    this.supplierService.getClientListMock(this.documentType).subscribe(data => {
      console.log('initMockClientList data', data);
      // this.clients = data;
    }, error => {
      this.notificationService.error('Impossible de récupérer les clients');
      console.log(error);
    });
  }

  private initDocument() {
    this.supplierService.getDocumentInformation(this.documentType).subscribe(data => {
      this.currentDocument = data;
    }, error => {
      this.notificationService.error('Impossible de récupérer les informations du document.');
      console.log(error);
    });
  }

}
