import { Component, OnInit, Input, OnChanges, SimpleChange} from '@angular/core';
import {cloneDeep, filter} from 'lodash';

@Component({
  selector: 'app-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})
export class SelectListComponent implements OnInit, OnChanges {

  @Input() suppliers: any[];
  selectedSuppliers: any = {};
  suppliersToDisplay = [];
  showEmptyMsg: Boolean = false;
  firstChange: Boolean = true;


  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if(changes.suppliers && changes.suppliers.currentValue) {
      this.firstChange = changes.suppliers.firstChange;
      for(let propName in this.selectedSuppliers) {
        if(this.selectedSuppliers[propName].checked === false) {
          delete this.selectedSuppliers[propName];
          continue;
        }
        if(this.selectedSuppliers[propName].show === false) {
          this.selectedSuppliers[propName].show = true;
        }
        for(let i=0; i < changes.suppliers.currentValue.length; i++) {
          if(changes.suppliers.currentValue[i].denomination === propName && this.selectedSuppliers[propName].checked === true) {
            changes.suppliers.currentValue.splice(i, 1);
          }
        }
      }
      changes.suppliers.currentValue.length === 0 ? this.showEmptyMsg = true : this.showEmptyMsg = false;
      this.suppliersToDisplay = cloneDeep(changes.suppliers.currentValue);
    }
  }

  selectSupplier(value, i) {
    let denom = this.suppliers[i]['denomination'];
    if(value) {
      this.selectedSuppliers[denom] = this.suppliers[i];
      this.selectedSuppliers[denom].checked = true;
      this.selectedSuppliers[denom].show = false;
    } else if(value === false && this.selectedSuppliers[denom]) {
      this.selectedSuppliers[denom].checked = false;
    }
  }

  uncheckSupplier(checked, denom) {
    if(checked === false && this.selectedSuppliers[denom]) {
      this.selectedSuppliers[denom].checked = false;
    } else if(checked === true && !this.selectedSuppliers[denom]) {
      this.selectedSuppliers[denom].checked = true;
    }
  }
}
