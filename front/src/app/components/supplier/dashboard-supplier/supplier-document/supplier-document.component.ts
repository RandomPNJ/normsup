import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SupplierService} from '../../../../services/supplier.service';
import {NotifService} from '../../../../services/notif.service';

@Component({
  selector: 'app-supplier-document',
  templateUrl: './supplier-document.component.html',
  styleUrls: ['./supplier-document.component.scss']
})
export class SupplierDocumentComponent implements OnInit {

  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private notificationService: NotifService
  ) {}

  supplierDocuments = [];

  ngOnInit(): void {
    this.supplierService.getDocumentsListMock().subscribe(data => {
      this.supplierDocuments = data;
    }, error => {
      console.log(error);
      this.notificationService.error('Impossible de récupérer la liste des documents.');
    });
  }

  open(supplierDocument) {
    this.router.navigate(['/supplier/dashboard/documents/details'], { queryParams: {
        documentType: supplierDocument.name
      }});
  }

}
