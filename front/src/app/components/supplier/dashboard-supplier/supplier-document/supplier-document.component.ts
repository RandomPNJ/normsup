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

  cards = [];

  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private notificationService: NotifService
  ) {}

  supplierDocuments = [];

  ngOnInit(): void {
    this.supplierService.getDocumentsListMock().subscribe(data => {
      this.supplierDocuments = data;
      this.initializeCards();
    }, error => {
      console.log(error);
      this.notificationService.error('Impossible de récupérer la liste des documents.');
    });
  }

  onBtnCardClickEvent(document) {
    this.router.navigate(['/supplier/dashboard/documents/details'], { queryParams: {
        documentType: document.name
      }});
  }

  initializeCards() {
    this.cards = [];
    if (this.supplierDocuments && 0 !== this.supplierDocuments.length) {
      this.supplierDocuments.forEach(supplierDoc => {
        this.cards.push({
          id: supplierDoc.id,
          // icon: supplierDoc.icon
          name: supplierDoc.name
        });
      });
    }
  }

}
