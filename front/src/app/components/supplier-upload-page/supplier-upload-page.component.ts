import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-supplier-upload-page',
  templateUrl: './supplier-upload-page.component.html',
  styleUrls: ['./supplier-upload-page.component.scss']
})
export class SupplierUploadPageComponent implements OnInit {



  authorized: Boolean;

  constructor(private httpService: HttpService) { 
    this.httpService.get('/api/supplier/currentSupplier')
      .subscribe(res => {
        console.log('currentSupplier', res)
      }, err => {

      })
    ;
  }

  ngOnInit() {
  }


}
