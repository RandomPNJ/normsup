import { Component, OnInit, Input, OnChanges, SimpleChange, Output} from '@angular/core';
import {cloneDeep, filter} from 'lodash';

@Component({
  selector: 'app-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})
export class SelectListComponent implements OnInit, OnChanges {

  @Input() suppliers: any[];
  @Input() onInitSuppliers: any[];
  count = 0;
  selectedSuppliers: any = {};
  suppliersToDisplay = [];
  showEmptyMsg: Boolean = false;
  firstChange: Boolean = true;
  

  constructor() { }

  ngOnInit() {
    if(this.onInitSuppliers && this.onInitSuppliers.length > 0) {
      let initValues = cloneDeep(this.onInitSuppliers);
      initValues.map(supp => {
        supp['checked'] = true;
        supp['show'] = true;
        for(let i=0; i < this.suppliers.length; i++) {
          if(this.suppliers[i].denomination === supp.denomination) {
            this.suppliers.splice(i, 1);
          }
        }
        this.selectedSuppliers[supp['denomination']] = supp;
      });
      this.firstChange = false;
    }
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
      if(this.selectedSuppliers[denom]) {
        this.selectedSuppliers[denom].checked = true;
        this.count++;
      } else {
        this.selectedSuppliers[denom] = this.suppliers[i];
        this.selectedSuppliers[denom].checked = true;
        this.selectedSuppliers[denom].show = false;
        this.count++;
      }
    } else if(value === false && this.selectedSuppliers[denom]) {
      this.selectedSuppliers[denom].checked = false;
      this.count--;
    }
  }

  uncheckSupplier(checked, denom) {
    if(checked === false && this.selectedSuppliers[denom]) {
      this.selectedSuppliers[denom].checked = false;
      this.count--;
    } else if(checked === true && this.selectedSuppliers[denom]) {
      this.selectedSuppliers[denom].checked = true;
      this.count++;
    }
  }

}
