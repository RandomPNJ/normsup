import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SupplierService} from '../../../../services/supplier.service';
import {NotifService} from '../../../../services/notif.service';
import * as moment from 'moment';

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
    private router: Router,
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
      this.clients = data.body['items'];  
    }, error => {
      this.notificationService.error('Impossible de récupérer les clients');
      console.log(error);
    });
  }

  private initDocument() {
    this.supplierService.getDocumentInformation(this.documentType).subscribe(data => {
      console.log('getDocumentInformation data', data);
      if(data.body['items'] && data.body['items'].length > 0) {
        let docData = data.body['items'][0];
        docData.user = {
          name: docData.name,
          lastname: docData.lastname,
        };
        docData.durationValidity = moment(docData.validityDate, 'YYYY-MM-DD HH:mm:ss').diff(moment(), 'days');
        docData.durationValidity = this.getDaysUntilDate(docData.durationValidity);
        // docData.durationValidity = (docData.durationValidity / 30).toString().split(".")[0] + 'M ' + docData.durationValidity % 30 + 'j';
        this.currentDocument = docData;
      } else {
        this.currentDocument = {};
      }
      console.log('this.currentDocument after', this.currentDocument);
    }, error => {
      this.notificationService.error('Impossible de récupérer les informations du document.');
      console.log(error);
    });
  }

  onClickDropOffButton() {
    this.router.navigate(['/supplier/dashboard/documents/drop-off'], { queryParams: {
      documentType: this.documentType
    }});
  }

  getDaysUntilDate(nbDays) {
    let res = ''
    let nbMonth = (nbDays / 30).toString().split(".")[0];
    let nbDaysRes = (nbDays % 30).toString();
    if(nbDaysRes === '0') {
      return "Expire aujourd'hui";
    } else if(nbMonth === "0") {
      res += nbDaysRes + ' j';
    } else {
      res += nbMonth + ' M ' + nbDaysRes + ' j';
    }
    return res;
  }
}
