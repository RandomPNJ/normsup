import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class SupplierService {

  constructor(
    private httpClient: HttpClient
  ) {}

  getMandatoryDocumentsListMock() {
    // TODO Must call API
    return of([
      {
        id: 1,
        type: 'KBIS',
        name: 'Extrait de KBIS',
        logoLink: '../../../assets/img/param-icn.svg',
        expirationDate: '2020-08-24 21:22:38'
      },
      {
        id: 2,
        type: 'ATTESTATION_VIGILANCE',
        name: 'Attestation de vigilance',
        logoLink: '../../../assets/img/param-icn.svg',
        expirationDate: '2020-04-12 21:22:38'
      },
      {
        id: 3,
        type: 'LISTE_TRAVAILLEURS',
        name: 'Liste nominative des travailleurs étrangers',
        logoLink: '../../../assets/img/param-icn.svg',
        expirationDate: '2020-12-24 21:22:38'
      }
    ]);
  }

  getOptionalDocumentsListMock() {
    // TODO Must call API
    return of([
      {
        id: 10,
        type: 'TRANSPORT',
        name: 'Licence de transport',
        logoLink: '../../../assets/img/param-icn.svg',
        expirationDate: '2020-08-24 21:22:38'
      },
      {
        id: 11,
        type: 'FISCALE',
        name: 'Attestation fiscale',
        logoLink: '../../../assets/img/param-icn.svg',
        expirationDate: '2020-08-24 21:22:38'
      },
      {
        id: 12,
        type: 'ASSURANCE',
        name: 'Attestation d\'assurance',
        logoLink: '../../../assets/img/param-icn.svg',
        expirationDate: '2020-08-24 21:22:38'
      }
    ]);
  }

  getClientListMock() {
    // TODO Must call API
    return of([
      {
        id: 1,
        name : 'SFR'
      },
      {
        id: 2,
        name : 'Pizzano Pizza'
      },
      {
        id: 3,
        name : 'Nike'
      },
      {
        id: 4,
        name : 'Bouygues Telecom'
      },
      {
        id: 1,
        name : 'SFR'
      },
      {
        id: 2,
        name : 'Pizzano Pizza'
      },
      {
        id: 3,
        name : 'Nike'
      },
      {
        id: 4,
        name : 'Bouygues Telecom'
      },
      {
        id: 1,
        name : 'SFR'
      },
      {
        id: 2,
        name : 'Pizzano Pizza'
      },
      {
        id: 3,
        name : 'Nike'
      },
      {
        id: 4,
        name : 'Bouygues Telecom'
      }
    ]);
  }

  getDocumentInformation(documentType) {
    // TODO Must call API
    // TODO create model object for data
    return of({
        name: 'Nom du document',
        type: documentType,
        expirationDate: '2022-09-24 14:25:01',
        uploadDate: '2020-09-24 14:25:01',
        durationValidity: 10,
        isValid: true,
        user: {
          id: 1,
          lastname: 'El Fahim',
          name: 'Yassin'
        }
      });
  }

}
