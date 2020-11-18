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

  mandatoryDocuments = [];
  optionalDocuments = [];

  ngOnInit(): void {
    this.supplierService.getMandatoryDocumentsListMock().subscribe(data => {
      this.mandatoryDocuments = data;
    }, error => {
      console.log(error);
      this.notificationService.error('Impossible de récupérer la liste des documents légaux.');
    });

    this.supplierService.getOptionalDocumentsListMock().subscribe(data => {
      this.optionalDocuments = data;
    }, error => {
      console.log(error);
      this.notificationService.error('Impossible de récupérer la liste des documents complémentaires.');
    });
  }

  onBtnCardClickEvent(document) {
    this.router.navigate(['/supplier/dashboard/documents/details'], { queryParams: {
        documentType: document.type
    }});
  }

  onBtnDropOffClickEvent(document) {
    // Drop off document
    this.router.navigate(['/supplier/dashboard/documents/drop-off'], { queryParams: {
        documentType: document.type
      }});
  }
}
