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
  selectedClient; // le client sélectionné

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private notificationService: NotifService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      this.documentType = data.documentType;

      this.initMockClientList();
    });
  }

  initMockClientList() {
    this.supplierService.getClientListMock().subscribe(data => {
      this.clients = data;
    }, error => {
      this.notificationService.error('Impossible de récupérer les clients');
      console.log(error);
    });
  }

  onClientRowClick(client) {
    if (client) {
      this.supplierService.getDocumentInformation(this.documentType, client.id).subscribe(data => {
        this.selectedClient = data;
      }, error => {
        this.notificationService.error('Impossible de récupérer les informations du document.');
        console.log(error);
      });
    } else {
      this.selectedClient = undefined;
    }
  }

}
