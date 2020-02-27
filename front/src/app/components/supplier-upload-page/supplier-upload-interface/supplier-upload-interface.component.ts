import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-upload-interface',
  templateUrl: './supplier-upload-interface.component.html',
  styleUrls: ['./supplier-upload-interface.component.scss']
})
export class SupplierUploadInterfaceComponent implements OnInit {


  documentStatus: any = {
    urssaf: true,
    lnte: false,
    kbis: false
  };
  
  compDocs: any[] = [
    {
      name: 'CompDocOne'
    },
    {
      name: 'CompDocTwo'
    },
    {
      name: 'CompDocThree'
    },
    {
      name: 'CompDocOne'
    },
    {
      name: 'CompDocTwo'
    },
    {
      name: 'CompDocThree'
    },
    {
      name: 'CompDocOne'
    },
    {
      name: 'CompDocTwo'
    },
    {
      name: 'CompDocThree'
    }
  ]
  type: string = 'LEGAL';

  constructor() { }

  ngOnInit() {
  }

  switchType(type) {
    if(type === 'LEGAL' || type === 'COMP') {
      this.type = type;
    }
  }

}
