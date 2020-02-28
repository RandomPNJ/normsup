import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { remove } from 'lodash';

@Component({
  selector: 'app-supplier-upload-interface',
  templateUrl: './supplier-upload-interface.component.html',
  styleUrls: ['./supplier-upload-interface.component.scss']
})
export class SupplierUploadInterfaceComponent implements OnInit {


  documentStatus: any = {
    urssaf: false,
    lnte: false,
    kbis: false
  };
  
  compDocs: any[] = [
  ]
  type: string = 'LEGAL';

  urssafDocument: any;
  lnteDocument: any;
  kbisDocument: any;
  compDocument: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  switchType(type) {
    if(type === 'LEGAL' || type === 'COMP') {
      this.type = type;
    }
  }

  inputFilechange(e, type) {
    console.log('inputFilechange', e)
    console.log('inputFilechange', e.target.files['0'])
    if(e.target && e.target.files && e.target.files['0']) {
      switch(type) {
        case 'Comp':
          this.compDocs.push(e.target.files['0']);
          this.compDocument = '';
          console.log('compDocs', this.compDocs);
          break;
        case 'Kbis':
          this.kbisDocument = e.target.files['0'];
          this.documentStatus.kbis = true;
          break;
        case 'Lnte':
          this.lnteDocument = e.target.files['0'];
          this.documentStatus.lnte = true;
          break;
        case 'Urssaf':
          this.urssafDocument = e.target.files['0'];
          this.documentStatus.urssaf = true;
          break;
      }
    }
  }

  sendDocuments() {
    alert('Ça ne marche pas encore.')
    this.router.navigate(['upload', 'success']);
  }

  deleteCompDoc(item) {
    remove(this.compDocs, (n) => {
      console.log('n name', n.name);
      console.log('item name', item.name);
      console.log('n.name === item.name', n.name === item.name);
      console.log('\n\n\n')
      return n.name === item.name;
    });
    console.log('deleteCompDoc', this.compDocs);
  }
}
