import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  supplierNmb = 7;
  items = [
    {
      status: true,
      name: 'vert',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },{
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },{
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },{
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },{
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    },{
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: true,
      lnte: true
    },
    {
      status: true,
      name: 'Orange',
      number: '92343843284',
      date: 1511950620,
      dateInv: 1511950620,
      urssaf: true,
      kbis: false,
      lnte: false
    }
  ];
  constructor() { }

  ngOnInit() {
  }


  edit(item) {
    console.log(item);
  }

  delete(item) {
    console.log(item);
  }
}
