import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-upload-page',
  templateUrl: './supplier-upload-page.component.html',
  styleUrls: ['./supplier-upload-page.component.scss']
})
export class SupplierUploadPageComponent implements OnInit {


  documentStatus: any = {
    urssaf: true,
    lnte: false,
    kbis: false
  };
  
  type: string = 'LEGAL';

  constructor() { }

  ngOnInit() {
  }

}
