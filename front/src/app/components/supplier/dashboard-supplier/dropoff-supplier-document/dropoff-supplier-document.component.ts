import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { NotifService } from 'src/app/services/notif.service';

@Component({
  selector: 'app-dropoff-supplier-document',
  templateUrl: './dropoff-supplier-document.component.html',
  styleUrls: ['./dropoff-supplier-document.component.scss']
})
export class DropoffSupplierDocumentComponent implements OnInit {

  documentType;

  currentDocument;

  constructor(
    private route: ActivatedRoute, private httpService: HttpService,
    private notifService: NotifService, private router: Router
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
    let file = form.get('file').value;
    let main_form: FormData = new FormData();
    
    main_form.append('files', file, 'k' + file.name);
    return this.httpService
        .uploadDocument('/api/documents/upload', main_form)
        .subscribe(res => {
          console.log('onKbisSaveEvent res', res);
          this.router.navigate(['supplier', 'dashboard', 'documents']);
          return this.notifService.success('Document KBIS ajouté avec succès.');
        })
    ;
  }

  onVigilanceCertificateSaveEvent(form) {
    const urssaf = form.get('urssaf').value;
    const otherOrganization = form.get('otherOrganization').value;
    const otherOrganizationName = form.get('otherOrganizationName').value;
    const file = form.get('file').value;

    console.log('In onVigilanceCertificateSaveEvent method');
    console.log({
      urssaf: urssaf,
      otherOrganization: otherOrganization,
      otherOrganizationName: otherOrganizationName,
      file: file
    });

    let main_form: FormData = new FormData();
    let name = '';
    if(urssaf) {
      name = 'u';
      main_form.append('urssaf_org', 'URSSAF');
    } else if(otherOrganization) {
      if(otherOrganizationName) {
        main_form.append('urssaf_org', otherOrganizationName);
      } else {
        main_form.append('urssaf_org', 'OTHER');
      }
    }

    main_form.append('files', file, 'u' + file.name);
    return this.httpService
        .uploadDocument('/api/documents/upload', main_form)
        .subscribe(res => {
          console.log('onKbisSaveEvent res', res);
          this.router.navigate(['supplier', 'dashboard', 'documents']);
          return this.notifService.success('Document KBIS ajouté avec succès.');
        })
    ;
  }

  onNominativeListForeignWorkerSaveEvent(form) {
    const nominativeList = form.get('nominativeList').value;
    const noNominativeList = form.get('noNominativeList').value;
    const file = form.get('file').value;

    console.log('In onNominativeListForeignWorkerSaveEvent method');
    console.log({
      nominativeList: nominativeList,
      noNominativeList: noNominativeList,
      file: file
    });
  }

  private initDocument() {
    // Call api by document type
    // If error, redirection
    if('KBIS' === this.documentType) {
      this.currentDocument = {
        name: 'Extrait de KBIS',
        type: this.documentType
      };
    }

    switch(this.documentType) {
      case 'KBIS':
        this.currentDocument = {
          name: 'Extrait de KBIS',
          type: this.documentType
        };
        break;
      case 'URSSAF':
        this.currentDocument = {
          name: 'Attestation de vigilance',
          type: this.documentType
        };
        break;
      case 'LNTE':
        this.currentDocument = {
          name: 'Liste nominative des travailleurs étrangers',
          type: this.documentType
        };
        break;
      default:
        this.currentDocument = {
        };
        break;
    }
  }
}
