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

  getDocumentsListMock() {
    // TODO Must call API
    return of([
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
      }
    ]);
  }

  getDocumentInformation(documentType, clientId) {
    // TODO Must call API
    // TODO create model object for data
    if (clientId % 2) { // if nb is pair
      return of({
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
    } else {
      return of({
        expirationDate: '2019-09-24 14:25:01',
        uploadDate: '2019-09-24 14:25:01',
        durationValidity: 4,
        isValid: false,
        user: {
          id: 2,
          lastname: 'BONNEROT',
          name: 'Julien'
        }
      });
    }
  }

}
